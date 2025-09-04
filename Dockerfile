# ---------- Base ----------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

# Install dependencies
RUN npm ci --include=dev

# Copy full repo
COPY . .

# ---------- Build API ----------
FROM base AS build-api
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
RUN npm --workspace apps/api run build

# ---------- Build Web ----------
FROM base AS build-web
RUN npm --workspace apps/web run build

# ---------- Runtime ----------
FROM node:20-alpine
WORKDIR /app

# Install pm2 to run multiple processes
RUN npm install -g pm2

# Copy node_modules + apps
COPY --from=build-api /app/node_modules ./node_modules
COPY --from=build-api /app/apps/api ./apps/api
COPY --from=build-web /app/apps/web/.next ./apps/web/.next
COPY --from=build-web /app/apps/web/public ./apps/web/public
COPY --from=build-web /app/apps/web/package*.json ./apps/web/
COPY --from=build-api /app/apps/api/package*.json ./apps/api/

# Env
ENV NODE_ENV=production
ENV API_PORT=4000
ENV WEB_PORT=3000
EXPOSE 4000 3000

# PM2 ecosystem to run both
COPY <<EOF ./ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./apps/api",
      script: "npm",
      args: "start",
      env: { PORT: 4000 }
    },
    {
      name: "web",
      cwd: "./apps/web",
      script: "npm",
      args: "start",
      env: { PORT: 3000 }
    }
  ]
}
EOF

CMD ["pm2-runtime", "ecosystem.config.js"]

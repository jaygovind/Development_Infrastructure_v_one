# apps/api/Dockerfile
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Root manifests + API manifest
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

# Install all workspaces (dev deps included for build)
RUN npm ci --include=dev

# Copy repo
COPY . .

# Generate client (will be v5.17.0 due to overrides)
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# Build API (script: prisma generate && tsc)
RUN npm --workspace apps/api run build

# ---- runtime ----
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules /app/node_modules

WORKDIR /app/apps/api
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package*.json ./

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node","dist/main.js"]

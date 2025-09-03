# ---------- Build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy root manifests (from root of repo)
COPY ../../package.json ../../package-lock.json ./

# Copy API manifest
COPY package.json ./

# Install dependencies (workspace aware)
RUN npm ci --include=dev

# Copy full repo for build
COPY ../../ ./

# Generate Prisma client
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# Build API
RUN npm --workspace apps/api run build

# ---------- Runtime ----------
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

# Copy API package.json
COPY --from=build /app/apps/api/package*.json ./

# Copy node_modules from build
COPY --from=build /app/node_modules /app/node_modules

# Copy dist + prisma
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]

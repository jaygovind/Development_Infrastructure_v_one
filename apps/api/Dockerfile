# apps/api/Dockerfile
FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl

# Work inside the API app so ./prisma/schema.prisma resolves
WORKDIR /app/apps/api

# Copy only the app's manifests first
COPY apps/api/package*.json ./

# Install deps (includes dev deps so we can build)
RUN npm ci

# Copy only what's needed for build (or copy the whole repo if required)
COPY apps/api ./

# Prisma schema now at ./prisma/schema.prisma
RUN npx prisma generate

# Build Nest app
RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node","dist/main.js"]

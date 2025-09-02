# apps/api/Dockerfile
FROM node:20-alpine AS build

# Needed for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

# Work inside the API app so ./prisma/schema.prisma resolves
WORKDIR /app/apps/api

# 1) Copy only API manifests first for better layer caching
COPY apps/api/package*.json ./

# 2) Install deps for the API
RUN npm ci

# 3) Copy the API source (including prisma) from the repo root context
COPY apps/api ./

# 4) Generate Prisma client (schema path is now valid)
RUN npx prisma generate --schema ./prisma/schema.prisma

# 5) Build Nest app
RUN npm run build


# --- Runtime image (smaller) ---
FROM node:20-alpine

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

# Only copy what we need to run
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package*.json ./

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node","dist/main.js"]

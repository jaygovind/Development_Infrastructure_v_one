FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

# 1) Copy ONLY api manifests (ensure lockfile exists & tracked)
COPY apps/api/package.json apps/api/package-lock.json ./

# 2) Clean, deterministic install (api-only)
RUN npm ci

# 3) Copy api sources (includes prisma/)
COPY apps/api ./

# 4) Build (runs prisma generate first because of script)
RUN npm run build


# -------- Runtime --------
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app/apps/api
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package*.json ./

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node","dist/main.js"]

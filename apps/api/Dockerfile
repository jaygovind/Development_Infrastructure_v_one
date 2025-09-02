# apps/api/Dockerfile
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl

# Work at repo root for workspaces
WORKDIR /app

# 1) Copy root + api manifests for better cache
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

# 2) Install all with root lockfile (workspaces)
RUN npm ci

# 3) Copy full repo
COPY . .

# 4) Generate prisma client for API (matching versions now)
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# 5) Build API workspace (script already runs prisma generate first, but ok)
RUN npm --workspace apps/api run build


# --- Runtime ---
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/package.json /app/package-lock.json /app/
COPY --from=build /app/apps/api/package*.json ./
# Use node_modules from build root (workspaces hoisting)
COPY --from=build /app/node_modules /app/node_modules

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node","dist/main.js"]

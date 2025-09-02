FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 1) root manifests + api manifest (for caching)
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

# 2) install all workspaces with root lockfile
RUN npm ci

# 3) copy full repo
COPY . .

# 4) prisma client for API
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# 5) build only API workspace
RUN npm --workspace apps/api run build

FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package*.json ./
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node","dist/main.js"]

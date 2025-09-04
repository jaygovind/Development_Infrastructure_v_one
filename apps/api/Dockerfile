# ---------- Build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy root manifests (root pe context hai)
COPY package.json package-lock.json ./

# Copy API workspace manifest
COPY apps/api/package.json apps/api/package.json

# Install all workspaces
RUN npm ci --include=dev

# Copy full repo
COPY . .

# Generate prisma client
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# Build API only
RUN npm run --workspace apps/api build


# ---------- Runtime ----------
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

# Copy API manifest
COPY --from=build /app/apps/api/package*.json ./

# Copy node_modules (workspace-aware)
COPY --from=build /app/node_modules /app/node_modules

# Copy dist + prisma
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/main.js"]

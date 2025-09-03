# ---------- Build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy root manifests
COPY ../../package.json ../../package-lock.json ./

# Copy API manifest (overwrite inside /app for workspace resolution)
COPY ../../apps/api/package.json ./apps/api/package.json

# Install dependencies (workspace-aware)
RUN npm ci --include=dev

# Copy rest of the repo
COPY ../../ ./

# Generate prisma client
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# Build API
RUN npm --workspace apps/api run build

# ---------- Runtime ----------
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

# Copy package.json
COPY --from=build /app/apps/api/package*.json ./

# Copy node_modules
COPY --from=build /app/node_modules /app/node_modules

# Copy build output + prisma
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]

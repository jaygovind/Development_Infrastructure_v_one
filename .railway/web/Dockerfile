# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy root manifests
COPY ../../package.json ../../package-lock.json ./

# Copy Web manifest
COPY ../../apps/web/package.json ./apps/web/package.json

# Install dependencies (workspace-aware)
RUN npm ci --include=dev

# Copy repo
COPY ../../ ./

# Ensure public exists
RUN mkdir -p apps/web/public

# Build web
RUN npm --workspace apps/web run build

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy Next.js build output
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/package*.json ./
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]

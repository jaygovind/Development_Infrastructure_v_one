# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy root manifests
COPY ../../package.json ../../package-lock.json ./
COPY ../../apps/web/package.json ./package.json

# Install dependencies
RUN npm ci --include=dev

# Copy full repo
COPY ../../ ./

# Build web workspace
RUN npm --workspace apps/web run build

# ---------- Runtime ----------
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/package*.json ./
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]

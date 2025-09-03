# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY ../../package.json ../../package-lock.json ./
COPY ../../apps/web/package.json ./package.json
RUN npm ci --include=dev

# Copy repo
COPY ../../ ./

# Make sure public exists
RUN mkdir -p apps/web/public

# Build only web
RUN npm --workspace apps/web run build

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy build artifacts
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/package*.json ./
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]

# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy root manifests
COPY ../../package.json ../../package-lock.json ./

# Copy API workspace manifest
COPY ../../apps/api/package.json ./package.json

# Install dependencies
RUN npm ci --include=dev

# Copy full repo for build
COPY ../../ ./

# Prisma generate + build
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
RUN npm --workspace apps/api run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app/apps/api

COPY --from=build /app/apps/api/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]

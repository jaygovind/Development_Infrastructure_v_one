# ---------- Build ----------
FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy root manifests + api manifest
COPY package.json package-lock.json ./          
COPY apps/api/package.json ./                    

# Install all workspaces (dev deps included for build)
RUN npm ci --include=dev

# Copy repo
COPY . .                                        

# Generate prisma client
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# Build API
RUN npm --workspace apps/api run build

# ---------- Runtime ----------
FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app/apps/api

# Copy API package.json only
COPY --from=build /app/apps/api/package*.json ./

# Copy node_modules
COPY --from=build /app/node_modules /app/node_modules

# Copy dist + prisma
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]

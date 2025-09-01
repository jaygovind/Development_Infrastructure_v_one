# syntax=docker/dockerfile:1

######## deps & build ########
FROM node:20-alpine AS builder
WORKDIR /app
# Prisma on Alpine needs these
RUN apk add --no-cache libc6-compat openssl

# 1) deps
COPY package*.json ./
RUN npm ci

# 2) source (relative to apps/api context)
COPY . .
# prisma/schema.prisma is now at /app/prisma/schema.prisma
RUN npx prisma generate

# 3) build (Nest)
RUN npm run build

######## runtime ########
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production

# install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy compiled app + prisma runtime bits
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# If your API listens on 4000, set PORT and expose it:
ENV PORT=4000
EXPOSE 4000

# Prefer starting the compiled app directly
CMD ["node", "dist/main.js"]

# syntax=docker/dockerfile:1

# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /repo
RUN apk add --no-cache libc6-compat openssl

# ---------- deps (install using root lock + workspace) ----------
FROM base AS deps
# copy only manifests needed to resolve the API workspace
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
# install deps only for the API workspace (uses root lockfile)
RUN npm ci --include-workspace-root --workspace=apps/api

# ---------- build ----------
FROM base AS builder
# reuse installed deps
COPY --from=deps /repo/node_modules ./node_modules
# now bring in the rest of the source (reduced by .dockerignore)
COPY . .
# generate prisma client for the API workspace
RUN npx prisma generate -w apps/api
# build the API workspace (Nest)
RUN npm run --workspace=apps/api build

# ---------- runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production
ENV PORT=4000

# install only prod deps for the API workspace
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev --include-workspace-root --workspace=apps/api

# copy build artifacts + prisma runtime bits
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/prisma ./prisma
# copy generated prisma client & engines (made in builder)
COPY --from=builder /repo/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /repo/node_modules/@prisma ./node_modules/@prisma

EXPOSE 4000
CMD ["node", "dist/main.js"]

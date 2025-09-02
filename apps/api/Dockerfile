# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# ---- deps (use root lock + API workspace) ----
FROM base AS deps
# 1) root manifests
COPY package.json package-lock.json ./
# 2) API workspace manifest (zaroori!)
COPY apps/api/package.json apps/api/package.json
# 3) install deps for API workspace using root lockfile
RUN npm ci --include-workspace-root --workspace=apps/api

# ---- build ----
FROM base AS builder
# reuse node_modules installed above
COPY --from=deps /app/node_modules ./node_modules
# now copy the full repo (code, prisma, etc.)
COPY . .
# prisma generate MUST run in the API workspace
RUN npm exec --workspace=apps/api prisma generate
# build Nest API (workspace script)
RUN npm run --workspace=apps/api build

# ---- runtime (small image) ----
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production
ENV PORT=4000

# install only prod deps for API workspace
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev --include-workspace-root --workspace=apps/api

# copy build artifacts + prisma runtime bits from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]

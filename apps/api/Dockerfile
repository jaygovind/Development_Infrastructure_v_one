# apps/api/Dockerfile
FROM node:20-alpine

# System deps for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

# Work from repo root inside container
WORKDIR /app

# 1) Copy ONLY package manifests first (better layer caching)
COPY package.json package-lock.json ./
# If your api has its own package.json (likely):
COPY apps/api/package.json apps/api/package.json

# 2) Install workspace deps at root (resolves inter-workspace deps correctly)
RUN npm ci

# 3) Copy the whole repo (now that deps are cached)
COPY . .

# 4) Generate Prisma client using the correct schema path
RUN npx prisma generate --schema apps/api/prisma/schema.prisma

# 5) Build only the API workspace (adjust if your script name differs)
RUN npm --workspace apps/api run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
# If Nest outputs to apps/api/dist/main.js
CMD ["node", "apps/api/dist/main.js"]

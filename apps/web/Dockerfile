# apps/web/Dockerfile

# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# 1) Install using ROOT lockfile (workspaces)
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --include=dev

# 2) Bring in the repo
COPY . .

# 3) Make sure public/ exists so COPY never fails later
RUN mkdir -p apps/web/public

# 4) Build ONLY web
# (expects "build": "next build" in apps/web/package.json)
RUN npm --workspace apps/web run build


# ---------- Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# If you use Next "standalone" output, prefer that (see note below).
# Non-standalone runtime (uses node_modules + .next):
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/package*.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]

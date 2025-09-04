# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Root deps
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --include=dev

# Copy full repo
COPY . .

# Build ONLY web workspace
RUN npm run --workspace apps/web build

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app/apps/web

COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/web/package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "--workspace=apps/web", "start"]

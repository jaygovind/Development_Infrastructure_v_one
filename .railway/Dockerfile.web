# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies using root lockfile (workspace-aware)
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --include=dev

# Copy the whole repo
COPY . .

# Make sure public exists
RUN mkdir -p apps/web/public

# Build ONLY web workspace
RUN npm --workspace apps/web run build

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy only what's needed
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/package*.json ./
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "start", "--workspace=apps/web"]

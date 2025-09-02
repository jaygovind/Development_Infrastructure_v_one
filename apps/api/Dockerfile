FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# 1) root + API manifests PEHLE copy karo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

# 2) workspace deps install karo root lockfile se
RUN npm ci --include-workspace-root --workspace=apps/api

# 3) ab baaki code copy karo
COPY . .

# 4) prisma generate ko workspace me chalao
RUN npm exec --workspace=apps/api prisma generate

# 5) build bhi workspace me
RUN npm run --workspace=apps/api build

ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node","dist/main.js"]

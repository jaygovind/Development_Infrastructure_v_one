FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
# Either:
# RUN npm install
# Or (deterministic inside the build, but lockfile isn't committed):
RUN npm install --package-lock-only && npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node","dist/main.js"]

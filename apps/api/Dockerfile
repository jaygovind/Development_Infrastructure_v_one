FROM node:20-alpine
WORKDIR /app
COPY apps/api/package*.json ./
RUN [ -f package-lock.json ] && npm ci || npm install
COPY apps/api ./
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]

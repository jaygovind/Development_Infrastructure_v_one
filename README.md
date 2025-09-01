# Next.js + NestJS + JWT Auth + MinIO Upload (Docker)

## Quick Start
```bash
cp .env.example .env
docker compose up -d --build
docker compose --profile app up -d api


# First-time DB migration (inside api container):
# docker compose exec api npx prisma migrate dev --name init


npm run -w apps/api prisma:migrate:dev
```

Open:
- Web: http://localhost:3000
- API: http://localhost:4000/health, /hello, /users
- pgAdmin: http://localhost:5050  (host: db, user/pass from .env)
- MinIO: http://localhost:9001  (use keys from .env)

## Auth & Upload
- Register: `POST /auth/register { email, password, name? }`
- Login: `POST /auth/login` → `{ access_token }`
- Protected upload: `POST /upload` with `Authorization: Bearer <token>` and multipart field `file`
- Client pages: `/register`, `/login`, `/upload`

## Local Dev (without dockerizing web/api)
```bash
npm i
docker compose up -d db minio pgadmin
npm run dev
```

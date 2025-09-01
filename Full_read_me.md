Next + Nest + Postgres + MinIO + pgAdmin — Step-by-Step
0) Prerequisites

Docker Desktop

Node.js 18/20+ & npm

1) Ports aur env (once)

Project root me .env banao (Compose ke liye):

# Postgres
POSTGRES_USER=app
POSTGRES_PASSWORD=app
POSTGRES_DB=appdb

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin

# MinIO (host pe yeh ports expose honge)
MINIO_API_PORT=9002
MINIO_CONSOLE_PORT=9011
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin


Notes

Postgres host port: 5433 (compose me 5433→5432 mapped)

MinIO Console: http://localhost:9011

2) Infra start (DB + pgAdmin + MinIO)
docker compose up -d
docker compose ps


Open:

pgAdmin: http://localhost:5050 (ya jo map kiya ho)
Login = admin@example.com / admin
Add Server → Host: db, Port: 5432, User/Pass: .env se

MinIO Console: http://localhost:9011
Keys: minioadmin / minioadmin

3) Local Dev Mode (recommended for speed)

Infra Docker me, API & Web locally.

3.1 API env files

apps/api/.env:

PORT=4000
JWT_SECRET=supersecret_jwt_key

# Localhost se Docker Postgres tak
DATABASE_URL=postgresql://app:app@localhost:5433/appdb?schema=public

# MinIO host ports (upar .env me set kiye the)
MINIO_ENDPOINT=localhost
MINIO_PORT=9002
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads


Prisma CLI kabhi kabhi prisma/.env bhi dhundta hai. Safe side:
apps/api/prisma/.env me same content copy kar do.

3.2 Web env

apps/web/.env.local:

NEXT_PUBLIC_API_URL=http://localhost:4000

3.3 Install deps (root + workspaces)
npm i
npm i -w apps/api
npm i -w apps/web


Agar @prisma/client/prisma version mismatch aaye:
npm i -w apps/api @prisma/client prisma

3.4 Prisma generate + migrate
npm run -w apps/api prisma:generate
npm run -w apps/api prisma:migrate:dev

3.5 Start servers

API (NestJS):

npm run dev:api


Health: http://localhost:4000/health

Web (Next.js App Router): naye terminal me

npm run dev:web


Open: http://localhost:3000

4) Full Docker Mode (API & Web bhi containers me)

Yeh tab chalao jab tum sab kuch Docker me hi run karna chahte ho.

# app profile ke sath poora stack
docker compose --profile app up -d --build

# migrate (api container ke andar)
docker compose exec api npx prisma migrate dev --name init


Open:

Web: http://localhost:3000

API: http://localhost:4000/health

pgAdmin: http://localhost:5050

MinIO: http://localhost:9011

5) Auth + Upload (demo flow)

Web par /register → user banega

/login → token localStorage me save

/upload → file choose + submit → MinIO me upload
API response: { objectName, presignedUrl }

6) Useful npm scripts (root)
# infra only (db + pgadmin + minio)
npm run docker:up

# everything down + volumes
npm run docker:down

# dev (local): web + api  (works on most shells)
npm run dev

# or individually
npm run dev:api
npm run dev:web

# prisma helpers
npm run migrate:dev
npm run prisma:studio

7) Quick troubleshoot
“@prisma/client did not initialize yet”

Run:

npm run -w apps/api prisma:generate
npm run -w apps/api prisma:migrate:dev


Make sure apps/api/.env (and apps/api/prisma/.env) me DATABASE_URL present hai.

“P1012 Environment variable not found: DATABASE_URL”

Local dev: apps/api/.env me DATABASE_URL=postgresql://app:app@localhost:5433/appdb?schema=public

Docker mode: docker compose --profile app up -d (compose sets DATABASE_URL=...@db:5432/... for container)

pgAdmin blank/ERR_EMPTY_RESPONSE

Container recreate:

docker compose rm -fs pgadmin
docker compose up -d pgadmin
docker compose logs -f pgadmin


Valid email use karo: PGADMIN_DEFAULT_EMAIL=admin@example.com.

Port already in use

Postgres (5433), MinIO (9002/9011), pgAdmin (5050) — change host mapping if clash.
Example MinIO:

ports:
  - "9005:9000"
  - "9015:9001"

MinIO upload TS error

putObject(bucket, name, data, size, meta) — use:

this.client.putObject(this.bucket, name, buffer, buffer.length, meta)

8) URLs (default)

Web: http://localhost:3000

API: http://localhost:4000

pgAdmin: http://localhost:5050

MinIO Console: http://localhost:9011

9) One-liners (TL;DR)

Local dev (fastest):

docker compose up -d
# create apps/api/.env & apps/api/prisma/.env (see above)
# create apps/web/.env.local (see above)
npm i && npm i -w apps/api && npm i -w apps/web
npm run -w apps/api prisma:generate
npm run -w apps/api prisma:migrate:dev
npm run dev:api         # terminal 1
npm run dev:web         # terminal 2


Full Docker:

docker compose --profile app up -d --build
docker compose exec api npx prisma migrate dev --name init
# infra only (db + pgadmin + minio)
npm run docker:up

# everything down + volumes
npm run docker:down

# run npm i in api and web
npm i
npm i -w apps/api 
npm i -w apps/web

# dev (local): web + api  (works on most shells)
npm run dev

# or individually
npm run dev:api
npm run dev:web

# prisma helpers
npm run migrate:dev
npm run prisma:studio

# migrate db change

 npm run -w apps/api prisma:generate
  npm run -w apps/api prisma:migrate:dev

  # for docker  Local test before pushing:
  docker build -f apps/api/Dockerfile -t api-test .
  docker run --rm -p 4000:4000 api-test


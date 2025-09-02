Nx Integration Guide

This repo was converted into an Nx monorepo to manage both the API (NestJS + Prisma) and Web (Next.js) apps in a single workspace with unified build, lint, and test workflows.

1. Install Nx in existing repo
# initialize Nx into an existing npm/yarn/pnpm workspace
npx nx@latest init


This created nx.json at the root and enabled Nx commands.

2. Add project configs

Each app got a project.json file inside apps/.

apps/api/project.json

Configured with nx:run-commands to call the existing npm scripts for build/lint/test:

{
  "name": "api",
  "root": "apps/api",
  "sourceRoot": "apps/api/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "npm --workspace apps/api run build" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "nx lint api" }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "nx test api" }
    }
  }
}

apps/web/project.json

Configured similarly, pointing to Next.js npm scripts:

{
  "name": "web",
  "root": "apps/web",
  "sourceRoot": "apps/web",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "npm --workspace apps/web run build" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "nx lint web" }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "nx test web" }
    },
    "serve": {
      "executor": "nx:run-commands",
      "options": { "command": "npm --workspace apps/web run dev" }
    }
  }
}

3. ESLint setup
API

Added apps/api/.eslintrc.cjs with TypeScript + Node rules.

Created apps/api/tsconfig.eslint.json for ESLint parsing.

Web

Added apps/web/.eslintrc.cjs extending Next.js + TS rules.

Disabled legacy react/react-in-jsx-scope (not needed in React 17+).

Relaxed @typescript-eslint/no-explicit-any initially to unblock build.

4. Jest setup

Added apps/api/jest.config.ts and apps/web/jest.config.ts.

Added jest.preset.js at the repo root:

const nxPreset = require('@nx/jest/preset');
module.exports = { ...nxPreset };

5. Build / Lint / Test with Nx
Run for API
npx nx build api
npx nx lint api
npx nx test api

Run for Web
npx nx build web
npx nx lint web
npx nx test web

6. Affected-Only in CI

Nx can run tasks only for changed projects:

# lint + test + build only for affected projects
npx nx affected -t lint,test,build


Add this in your GitHub Actions / CI pipeline.

7. Extras

Disabled Nx Cloud token warnings in CI by setting:

env:
  NX_DISABLE_CLOUD: "true"


Dockerfiles for apps/api and apps/web use the same workspace root with lockfile caching.

✅ With this setup, both apps/api and apps/web are now fully integrated into Nx, and you can use nx build, nx lint, nx test, and nx affected in local dev and CI/CD.
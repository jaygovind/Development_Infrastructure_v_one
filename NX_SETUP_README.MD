Option 2 — (Recommended) Repo ko Nx workspace bana do (5–10 min)
1) Dev deps add karo
# repo root
npm i -D nx@21 @nx/workspace@21

2) nx.json banao (repo root)

nx.json:

{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "workspaceLayout": { "appsDir": "apps", "libsDir": "libs" },
  "targetDefaults": {
    "build": { "cache": true },
    "lint": { "cache": true },
    "test": { "cache": true }
  }
}


(Optional) libs/ folder abhi nahi hai to koi problem nahi.

3) apps/api/project.json

Minimal mapping jo aapke npm scripts ko Nx targets banata hai:

{
  "name": "api",
  "root": "apps/api",
  "sourceRoot": "apps/api/src",
  "targets": {
    "build": {
      "executor": "@nx/workspace:run-commands",
      "options": { "command": "npm --workspace apps/api run build" }
    },
    "lint": {
      "executor": "@nx/workspace:run-commands",
      "options": { "command": "echo \"no lint configured yet\"" }
    },
    "test": {
      "executor": "@nx/workspace:run-commands",
      "options": { "command": "echo \"no tests yet\"" }
    }
  }
}

4) apps/web/project.json
{
  "name": "web",
  "root": "apps/web",
  "sourceRoot": "apps/web",
  "targets": {
    "build": {
      "executor": "@nx/workspace:run-commands",
      "options": { "command": "npm --workspace apps/web run build" }
    },
    "lint": {
      "executor": "@nx/workspace:run-commands",
      "options": { "command": "echo \"no lint configured yet\"" }
    },
    "test": {
      "executor": "@nx/workspace:run-commands",
      "options": { "command": "echo \"no tests yet\"" }
    }
  }
}


Baad me chaaho to proper executors laga sakte ho (@nx/next:build, @nx/node:build, @nx/eslint:lint, @nx/jest:jest), abhi ke liye npm scripts wrap karna fast hai.

5) (Optional) root package.json me Nx scripts add
{
  "scripts": {
    "nx": "nx",
    "affected:build": "nx affected -t build",
    "affected:lint": "nx affected -t lint",
    "affected:test": "nx affected -t test"
  }
}

6) Test locally
npx nx graph          # projects dikhen
npx nx print-affected --target=build --select=projects
npx nx affected -t build

7) CI workflow (jo maine pehle diya) ab kaam karega

actions/checkout@v4 with fetch-depth: 0 keep karke

nrwl/nx-set-shas@v4 step rahega

npx nx affected -t lint/test/build steps run honge

Bonus: Proper Nx plugins (jab time mile)

API (Nest/Node): npm i -D @nx/node @nx/eslint @nx/jest (ya @nx/nest agar Nest schematics chahiye)

Web (Next): npm i -D @nx/next @nx/eslint @nx/jest

Phir project.json me executors replace:

API build → @nx/js:tsc (tsconfig/build options)

Web build → @nx/next:build

Lint → @nx/eslint:lint

Test → @nx/jest:jest

Filhaal, upar wala minimal setup Nx ko bootstrap karta hai, CI pass ho jayega, aur affected + caching ka fayda milna shuru ho jayega.
🚀 Steps to Deploy Monorepo (Frontend + Backend) to Railway with GitHub Actions
1. Create 2 Services in Railway

Go to your Railway project.

Add one service for backend (Node.js / API).

Add another service for frontend (React / Next.js or whichever framework you use).

Each service will have a unique Service ID.

2. Add Secrets in GitHub

In your repo go to:
Settings → Secrets and variables → Actions → New repository secret

Add these:

RAILWAY_TOKEN → from Railway Account Tokens

RAILWAY_BACKEND_SERVICE_ID → the backend service ID from Railway

RAILWAY_FRONTEND_SERVICE_ID → the frontend service ID from Railway

3. Update Your GitHub Actions Workflow (ci.yml)

Your workflow will have 3 jobs:

verify → Runs Nx lint, test, and build (only affected projects).

release → Runs release logic (like semantic-release).

deploy → Deploys both frontend and backend services to Railway.


*********************************
✅ 2 Ways to Fix
Option 1: Set Root Directory = Monorepo root in Railway

Go to your API service → Settings → Source → Add Root Directory.

Set it to . (monorepo root).

Then Railway will send the whole repo to Docker, and your Dockerfile will work as-is.

This is the cleanest fix.


👉 So to fix your Railway API deploy:

Make sure in Railway settings → Build → Root Directory = . (monorepo root).

Keep the Dockerfile above in apps/api/Dockerfile.

Push again, Railway will successfully find /apps/api/package.json.


**********************************************

🔑 Step 1: Generate a Railway Project Token

Go to Railway Dashboard
.

Open your project.

In the sidebar → Settings → Generate Deploy Token.
(It will look like railway_production_token_abc123...).

Copy it.

🔑 Step 2: Add to GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions.

Add a new secret:

Name: RAILWAY_TOKEN

Value: <your generated deploy token>

🔑 Step 3: Update Your CI Workflow

Your CI workflow should pass this token to the Railway CLI.
Here’s an updated snippet for deploy job:
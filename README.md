<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Oliur Tech Web App

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7553a67a-3c4c-4642-a629-3652050b5aa7

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Create a `.env` file from `.env.example`.
3. Set the Firebase variables and other keys in `.env`.
4. Run the app locally:
   `npm run dev`

If PowerShell blocks `npm` scripts, use:
   `node --loader tsx server.ts`

### Firebase Setup

If you want to use Firebase as the backend database, configure the following environment variables in `.env`:

- `FIREBASE_PROJECT_ID` - your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT_PATH` - relative path to a Firebase service account JSON file
- Or, alternatively, set `GOOGLE_APPLICATION_CREDENTIALS` to a valid service account JSON path

The server will use Firestore collections for `products`, `orders`, `serviceRequests`, `users`, and `banners` when Firebase is enabled.

### AWS DynamoDB Setup

If you want to use AWS DynamoDB as the backend database, configure the following environment variables in `.env`:

- `AWS_REGION` - your AWS region
- `AWS_TABLE_NAME` - the DynamoDB table name
- `AWS_ACCESS_KEY_ID` - your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - your AWS secret access key
- `AWS_SESSION_TOKEN` - optional temporary session token

The server will use DynamoDB when AWS credentials and table name are provided. The DynamoDB table should use `pk` as partition key and `sk` as sort key. Records are stored with `pk=collection` and `sk=id`.

### AWS RDS Postgres Setup

If you want to use AWS RDS Postgres with IAM auth, configure these environment variables in `.env`:

- `PGHOST` - your RDS host
- `PGPORT` - your RDS port
- `PGUSER` - your database user
- `PGDATABASE` - your database name
- `AWS_REGION` - the AWS region for the RDS instance
- `AWS_ROLE_ARN` - the ARN of the IAM role used for IAM auth

This project now includes a reusable RDS pool helper in `server/rds.ts`. It uses `@aws-sdk/rds-signer` to generate IAM auth tokens, and `@vercel/oidc-aws-credentials-provider` / `@vercel/functions` for Vercel compatibility.

### RDS test route

A new route is available at `/api/rds-test` to verify the AWS RDS connection once your env is configured.

## Deploy to Vercel

1. Connect this GitHub repository to Vercel.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Deploy the project.

API routes are served from `/api/*` on Vercel.

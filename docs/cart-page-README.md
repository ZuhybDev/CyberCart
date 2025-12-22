---
# Cart Page - README

This README explains how to use the Cart page included in CyberCart, lists requirements, and shows environment variables needed to run the page and the app.

Requirements
- Node.js (recommended LTS >= 18) and npm or yarn
- A database reachable via `DB_URL` (Postgres, MySQL, MongoDB — whatever your app expects)
- Clerk account for authentication and authorization
- Inngest account or configuration for background jobs (optional but recommended for order processing)
- Cloudinary account for image uploads

Environment variables
Copy these into a `.env` file at the project root. Below is the exact block you provided (kept as-is):

#Node env
NODE_ENV=development
#PORT
PORT=3000

#database URL
DB_URL=mydb
# clerk for auth and authrization
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# inngest for backeground jobs
INNGEST_SIGNING_KEY=
CLOUDNARY_API_KEY=
CLOUDNARY_SECRET_KEY=
CLOUDNARY_CLOUD_NAME=

ADMIN_EMAIL=

Notes about the env block
- The variable names are kept exactly as provided. If you intended to use Cloudinary you may want to rename `CLOUDNARY_*` to `CLOUDINARY_*` in your code and .env (or keep the current names if your code expects them).
- Set `DB_URL` to your database connection string.
- `CLERK_PUBLISHABLE_KEY` is safe to use on the client; `CLERK_SECRET_KEY` must remain secret on the server.
- `ADMIN_EMAIL` should be set to the address that receives admin notifications or order alerts.

Installation & usage
1. Install dependencies

```bash
npm install
# or
# yarn
```

2. Create a `.env` file in the repository root and paste the environment variables above, filling the blanks.

3. Run the development server

```bash
npm run dev
# or
# NODE_ENV=development PORT=3000 npm run dev
```

4. Build and start in production

```bash
npm run build
npm start
```

Tips & troubleshooting
- If you use Clerk, follow Clerk's docs to configure redirect URLs and API keys.
- If images fail to upload, check Cloudinary credentials and your upload code.
- Check logs for Inngest background job failures; ensure `INNGEST_SIGNING_KEY` is set.

If you want, I can commit these files to the `main` branch of the repo now. Reply and I will add them.
---

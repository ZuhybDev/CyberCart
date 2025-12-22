# CyberCart - README

This README explains how to use the CyberCart and what environment variables and requirements are needed to run the CyberCart application.

Who this is for
- Developers who want a quick, single-file guide to run and test the Cart page locally.

Requirements
- Node.js (recommended LTS, >= 18)
- npm or yarn
- A database reachable via DB_URL (Postgres, MySQL, MongoDB, etc.)
- Clerk account (for authentication)
- Cloudinary account (for image uploads, optional)
- Inngest account (for background jobs, optional)

Environment variables
Create a `.env` file at the project root and add the following variables (fill values as appropriate):

```env
# Node env
NODE_ENV=development
# PORT
PORT=3000

# database URL
DB_URL=mydb
# clerk for auth and authorization
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# inngest for background jobs
INNGEST_SIGNING_KEY=
CLOUDNARY_API_KEY=
CLOUDNARY_SECRET_KEY=
CLOUDNARY_CLOUD_NAME=

ADMIN_EMAIL=
```

Notes
- The variable names are exactly as used in the project; if you prefer the standard spelling for Cloudinary, rename `CLOUDNARY_*` to `CLOUDINARY_*` both in the `.env` and in the code.
- `CLERK_PUBLISHABLE_KEY` is safe to expose on the client. Keep `CLERK_SECRET_KEY` private (server-side only).
- `DB_URL` should be a full connection string (e.g., `postgres://user:pass@host:5432/dbname`).

Quick start
1. Install dependencies

```bash
npm install
# or
# yarn
```

2. Add the `.env` file at the repository root (copy the block above and fill values).

3. Run the development server

```bash
npm run dev
# or
# NODE_ENV=development PORT=3000 npm run dev
```

What the CyberCart does
- Shows the user's shopping cart, product list, quantities, prices, and total.
- Allows add/remove/update quantity actions.
- Integrates with Clerk for authentication, Inngest for background jobs, and Cloudinary for image uploads when available.

Where to find or place the CyberCart (example locations)
- Express/React: implement a route `/server` , `/admin` and `/client`


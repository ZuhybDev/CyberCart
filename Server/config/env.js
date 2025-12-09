import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  CLOUDNARY_API_KEY: process.env.CLOUDNARY_API_KEY,
  CLOUDNARY_SECRET_KEY: process.env.CLOUDNARY_SECRET_KEY,
  CLOUDNARY_CLOUD_NAME: process.env.CLOUDNARY_CLOUD_NAME,
};

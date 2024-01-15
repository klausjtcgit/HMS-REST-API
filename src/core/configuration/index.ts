import { config } from "dotenv";

// istanbul ignore next
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  NODE_ENV,
  PORT,
  TOKEN_KEY,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  COMPANY_NAME,
} = process.env;

import path from "node:path";

import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: path.join(__dirname, ".env.local"),
});

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});

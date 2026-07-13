import "dotenv/config";
import { defineConfig } from "prisma/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma v7: Connection configuration lives here, NOT in schema.prisma
// DATABASE_URL = Supabase Transaction URL (port 6543, PgBouncer pooled)
// DIRECT_URL   = Supabase Session URL   (port 5432, direct for migrations)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});

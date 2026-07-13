-- Run this in the Supabase SQL Editor to instantly set up your database for NanoLink
-- You don't need to run `npx prisma db push` if you run this script!

CREATE TABLE IF NOT EXISTS "public"."Link" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "customAlias" TEXT,
    "password" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "oneTimeUse" BOOLEAN NOT NULL DEFAULT false,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "lastVisited" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Link_shortCode_key" ON "public"."Link"("shortCode");
CREATE UNIQUE INDEX IF NOT EXISTS "Link_customAlias_key" ON "public"."Link"("customAlias");

-- Create performance indexes (for the dashboard and redirect lookups)
CREATE INDEX IF NOT EXISTS "Link_shortCode_idx" ON "public"."Link"("shortCode");
CREATE INDEX IF NOT EXISTS "Link_customAlias_idx" ON "public"."Link"("customAlias");
CREATE INDEX IF NOT EXISTS "Link_createdAt_idx" ON "public"."Link"("createdAt");

-- Set up Row Level Security (RLS) policies (Optional but recommended)
-- This allows your Next.js API route (using the connection string) to read/write, 
-- but prevents public anonymous access directly to the database.
ALTER TABLE "public"."Link" ENABLE ROW LEVEL SECURITY;

-- Note: Since you are using the Prisma Postgres adapter with your connection string 
-- in Next.js, Prisma connects as the `postgres` admin role which automatically 
-- bypasses RLS. You don't need to add specific policies for the app to work!

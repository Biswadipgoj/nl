# NanoLink — Complete Setup Guide

This guide covers everything you need to know to get NanoLink running locally on your machine with Supabase and Prisma.

## Prerequisites

Before starting, ensure you have the correct version of Node.js installed. **Prisma requires Node.js v20.19+, v22.12+, or v24.0+.**
If you see an error like `Prisma only supports Node.js versions...`, you must download and install the latest LTS release from [nodejs.org](https://nodejs.org/).

---

## Step 1: Create a Supabase Project

NanoLink uses Supabase for both the PostgreSQL database and Authentication.

1. Log in to [Supabase](https://supabase.com/) and create a new project.
2. Wait a minute for the database to provision.

---

## Step 2: Configure Environment Variables

You need to connect your local Next.js app to your new Supabase project.

1. In your project root, copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Go to your Supabase Dashboard.
3. Click the **Connect** button in the top right corner of the project overview page.
4. Go to the **URI** tab to find your connection strings.
5. Update your `.env` file with these values:

```env
# 1. Connection Pooling (Port 6543, used for app queries)
# Make sure "Use connection pooling" is CHECKED in Supabase.
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Direct Connection (Port 5432, used for Prisma migrations)
# Make sure "Use connection pooling" is UNCHECKED in Supabase.
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# 3. API Keys (Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# 4. Local URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

*(Note: Replace `[YOUR-PASSWORD]` with your actual database password!)*

---

## Step 3: Initialize the Database

Now that your app can connect to Supabase, you need to create the required tables (like the `Link` table).

Run the following command in your terminal:
```bash
npx prisma db push
```

*This will read your `prisma/schema.prisma` file and safely create all the necessary tables in your remote Supabase database.*

---

## Step 4: Setup OAuth (Optional but Recommended)

By default, guests can only create 1 short link. To unlock the dashboard, you should configure GitHub or Google login.

1. In the Supabase Dashboard, go to **Authentication > URL Configuration**.
2. Add `http://localhost:3000/auth/callback` to the **Redirect URLs**.
3. Go to **Authentication > Providers**.
4. Enable **GitHub** and/or **Google** and provide your OAuth Client ID and Secret from those platforms.

---

## Step 5: Run the App

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. NanoLink is now fully configured and running locally!

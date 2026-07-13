# NanoLink — Quick Setup & Deployment

The fastest way to get NanoLink running in production is to use the Vercel 1-Click Deploy. This handles all the heavy lifting, including provisioning your Supabase PostgreSQL database automatically.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBiswadipgoj%2Fnl&project-name=nanolink&repository-name=nanolink&integration-ids=oac_jUqjzQpB410jB2J2Z99Bw7iC)

## Getting Started (1-Click Deployment)

1. Click the **Deploy with Vercel** button above.
2. Log in with your GitHub account when prompted.
3. Vercel will ask to add the **Supabase integration**. Click **Add Integration** — this will automatically:
   - Create a new Supabase project for you.
   - Provision your PostgreSQL database with connection pooling.
   - Automatically inject all the required database environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) into your Vercel project.
4. Click **Deploy**. Vercel will build and launch your application.

---

## Step 2: Initialize Your Database Schema

Once your Vercel project is deployed, you need to push the Prisma schema to your newly created Supabase database.

1. In your Vercel project dashboard, go to the **Storage** tab or **Settings > Environment Variables**.
2. Copy the `DIRECT_URL` and `DATABASE_URL` values.
3. Open your terminal locally, paste them into your local `.env` file, and run:

```bash
# Push the schema to your database
npx prisma db push
```

*(This creates the required `Link` table in your Supabase database).*

---

## Step 3: Setup OAuth (Optional but Recommended)

By default, users can create 1 short link as a guest. To unlock the dashboard, you need to configure OAuth.

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication > URL Configuration**.
   - Set the **Site URL** to your Vercel production domain (e.g., `https://nanolink.vercel.app`).
   - Add your local environment (`http://localhost:3000/auth/callback`) to the **Redirect URLs**.
3. Navigate to **Authentication > Providers**.
   - **GitHub**: Enable it, and provide the Client ID and Secret from your GitHub Developer Settings.
   - **Google**: Enable it, and provide the Client ID and Secret from your Google Cloud Console.
   *(Make sure to add the Supabase Callback URL provided in this tab to your GitHub/Google OAuth app settings).*

---

## Local Development

To run NanoLink on your own machine:

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Link your Vercel environment variables (this safely pulls your Supabase URLs so you don't have to copy them manually):
   ```bash
   npx vercel env pull .env
   ```
3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

You're ready to go! NanoLink is fully production ready with Next.js App Router, Prisma v7, and Supabase Auth.

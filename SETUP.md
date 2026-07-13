# NanoLink — Supabase & Vercel Setup Guide

Follow these steps in order to get NanoLink live in production.

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New project**, give it a name (e.g. `nanolink`), and choose a region close to your users.
3. Wait ~2 minutes for the project to be provisioned.

---

## Step 2 — Get Your Database Connection Strings

1. In your Supabase project, go to **Settings → Database**.
2. Scroll down to **Connection string**.
3. Select the **Transaction** tab — this is your **`DATABASE_URL`** (port 6543, goes through PgBouncer).
4. Select the **Session** tab — this is your **`DIRECT_URL`** (port 5432, direct connection for migrations).
5. Replace `[YOUR-PASSWORD]` with your database password.

> ⚠️ **Important:** The `DATABASE_URL` must include `?pgbouncer=true` at the end.

---

## Step 3 — Enable OAuth Providers

1. In Supabase, go to **Authentication → Providers**.
2. Enable **GitHub**:
   - Go to [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App.
   - Homepage URL: `https://your-domain.com`
   - Callback URL: `https://xxxx.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret** into Supabase.
3. Enable **Google**:
   - Go to [console.cloud.google.com](https://console.cloud.google.com) → Credentials → Create OAuth 2.0 Client ID.
   - Authorized redirect URI: `https://xxxx.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret** into Supabase.

---

## Step 4 — Set the Redirect URL

1. In Supabase, go to **Authentication → URL Configuration**.
2. Set **Site URL** to your production domain (e.g. `https://nanolink.vercel.app`).
3. Under **Redirect URLs**, add:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

---

## Step 5 — Run the Database Migration

Once your `DATABASE_URL` and `DIRECT_URL` are in your `.env` file, run:

```bash
npx prisma db push
```

This creates the `Link` table with all required columns including `userId`.

---

## Step 6 — Deploy to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Before deploying, click **Environment Variables** and add all variables from `.env.example`:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Supabase Transaction URL (port 6543) |
   | `DIRECT_URL` | Supabase Session URL (port 5432) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL |

4. Click **Deploy**.

---

## Step 7 — Verify

- Visit `https://your-domain.com` — the homepage should load.
- Click **Sign In** and authenticate with GitHub or Google.
- Create a short link and verify the redirect works.
- Visit `/dashboard` and confirm your link appears.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `@supabase/ssr: Your project's URL and API key are required` | Supabase env vars are missing from Vercel. Add them in Project → Settings → Environment Variables. |
| `Can't reach database server` | Make sure `DATABASE_URL` uses port **6543** (PgBouncer) and includes `?pgbouncer=true`. |
| OAuth redirects to `/auth/auth-code-error` | The redirect URL in Supabase doesn't match. Check Step 4. |
| Links not appearing in dashboard | The `userId` column may not exist yet. Run `npx prisma db push`. |

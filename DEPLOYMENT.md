# Deployment Guide

This project is set up to deploy as:

- frontend on Vercel
- auth and database on Supabase

## 1. Create Supabase project

In Supabase:

1. Create a new project
2. Open the SQL editor
3. Run the SQL from `supabase/schema.sql`
4. Copy:
   - Project URL
   - Publishable key

## 2. Local environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Then fill in:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 3. Local verification

Run:

```bash
npm install
npm run dev
```

Then verify:

- sign up works
- sign in works
- task creation persists after refresh
- signing out hides task data

## 4. Vercel deployment

In Vercel:

1. Import the repository
2. Framework preset: `Vite`
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy

## 5. Post-deploy checks

After deployment, test:

- sign up from production URL
- sign in from production URL
- create, edit, reorder, and delete tasks
- refresh and confirm tasks reload from Supabase
- sign out and confirm workspace clears

## Notes

- Vite only exposes client environment variables that use the `VITE_` prefix.
- This app intentionally uses the Supabase publishable key on the client. Access control is enforced by Supabase Auth and Row Level Security policies, not by hiding the key.

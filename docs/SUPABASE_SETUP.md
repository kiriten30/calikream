# Supabase Setup

1. Create a free Supabase project.
2. In the Supabase SQL editor, run [schema.sql](/d:/aiderusingopenrouter/clineproject forcalistenucs/supabase/schema.sql).
3. In `Authentication -> URL Configuration`, set your site URL to your Vercel domain and add `http://localhost:3000` as an additional redirect URL for local development.
4. In `Authentication -> Providers`, enable email/password. Enable Google or Apple later only if you want those buttons live.
5. Copy `.env.example` to `.env` locally and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Add the same environment variables in Vercel before deploying.

Notes:
- The app now works gracefully without env vars, but auth stays disabled until they are set.
- The `profiles` row is created automatically from `auth.users`, and the frontend also upserts profile data after sign-in when a session exists.

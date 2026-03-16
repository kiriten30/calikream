# Vercel Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel on the free plan.
3. Add these environment variables in the Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Keep the default Vite build, or use the values in [vercel.json](/d:/aiderusingopenrouter/clineproject forcalistenucs/vercel.json).
5. Deploy.
6. After the first deploy, add your Vercel production URL to Supabase redirect URLs.
7. Test:
   - `/`
   - `/login.html`
   - `/signup.html`
   - `/pages/planche.html`
   - login/signup/logout flow

Free-tier expectation:
- Vercel hosts the static multi-page frontend.
- Supabase handles auth and the `profiles` table.
- Course content remains static for now and can be expanded later.

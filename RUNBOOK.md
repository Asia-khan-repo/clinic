# ClinicFlow Runbook

## Prerequisites

- Node.js 24+
- A Supabase project (URL + anon key from Project Settings → API)
- Supabase CLI logged in (`supabase login`)

## Local setup

```bash
npm ci
cp .env.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Create the first doctor account in Supabase → Authentication → Users → Add user,
then sign in at `http://localhost:3000/login`.

## Database migrations

Schema lives in `supabase/migrations/`. Apply it yourself, in order:

```bash
supabase link --project-ref <project-ref>
supabase migration list --linked
supabase db push --dry-run
supabase db push
```

Never edit the schema only in the Supabase dashboard: create a new migration
instead (`supabase migration new <name>`) and commit it.

## Checks (same as CI)

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## CI and branch protection

`.github/workflows/ci.yml` runs all four checks on every pull request and on
pushes to `main`. It uses no repository secrets, so fork/PR runs stay safe.

Protect `main` in GitHub → Settings → Branches: require a pull request, require
the `CI / checks` status check, block direct pushes.

## Environments (Vercel)

| Environment | Supabase project | Notes |
| --- | --- | --- |
| Preview | dev/staging project | never point previews at production data |
| Production | production project | set vars in Vercel → Project → Settings → Environment Variables |

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` per
environment. Never commit `.env.local`.

## Post-deploy verification

```bash
curl --fail --silent --show-error https://<your-domain>/api/health
# {"status":"ok"}
```

Then sign in and create one test patient to confirm auth + RLS.

## Rollback

Vercel → Project → Deployments → previous good deployment → "Promote to
Production". Confirm `/api/health` afterwards, and check Supabase migrations
before rolling back code that depends on a newer schema.

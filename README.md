# ClinicFlow

A small one-page medical record app for a single doctor: sign in, add/search
patients, record visits and prescribed medicines. Data lives in Supabase with
row-level security per doctor.

- Stack: Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel
- PRD: [`ClinicFlow_PRD.md`](./ClinicFlow_PRD.md)
- Setup, migrations, CI, deploy, rollback: [`RUNBOOK.md`](./RUNBOOK.md)

```bash
npm ci
npm run dev      # http://localhost:3000
```

Checks: `npm run lint && npm run typecheck && npm test && npm run build`

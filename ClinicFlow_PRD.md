# Product Requirements Document (PRD)

## Project Name
**ClinicFlow**

## 1. Product Summary
ClinicFlow is a simple one-page medical record application built with **Next.js** for hands-on DevOps, CI/CD, Vercel, and Supabase practice.

The app is designed for a doctor who sees patients during the day and wants to save each patient's basic information, visit details, diagnosis/assessment, notes, and prescribed medicines.

The application should stay intentionally small. The main learning goal is not complex feature development. The goal is to practise a real production workflow using GitHub, GitHub Actions, Vercel, and Supabase.

---

## 2. Main Goal
Build a small production-style application where a doctor can:

- Sign in securely
- Add a new patient
- Search existing patients
- Open a patient record
- Save a new visit
- Add diagnosis or assessment
- Add clinical notes
- Add prescribed medicines
- View previous visits
- Store all application data in Supabase

---

## 3. Technology Stack

### Frontend
- **Next.js**
- **TypeScript**
- **App Router**
- **Tailwind CSS**
- React Server and Client Components where appropriate

### Backend / Database
- **Supabase**
- Supabase Postgres
- Supabase Auth
- Supabase Row Level Security (RLS)

### Deployment
- **Vercel**

### Source Control and CI/CD
- **GitHub**
- **GitHub Actions**

---

## 4. Application Scope

### Authentication
The doctor must sign in before accessing patient data.

For the first version:
- Email/password authentication is enough
- Only authenticated doctors can access the application
- Each doctor's patient data must be isolated from other doctors

### Main Page
After login, the doctor sees one main dashboard page.

The page should contain:

#### Patient Search
- Search by patient name
- Search by phone number

#### Add Patient
Fields:
- Full name
- Age
- Gender
- Phone number
- Optional address

#### Patient Record
When a patient is selected, show:
- Patient information
- Previous visit history
- Button to add a new visit

#### New Visit
Fields:
- Visit date
- Symptoms / complaint
- Diagnosis / assessment
- Clinical notes

#### Medicines
Each visit can contain multiple medicines.

Medicine fields:
- Medicine name
- Dose
- Frequency
- Duration
- Optional instructions

---

## 5. Suggested Database Design

### `patients`
Fields:
- `id`
- `doctor_id`
- `full_name`
- `age`
- `gender`
- `phone`
- `address`
- `created_at`

### `visits`
Fields:
- `id`
- `patient_id`
- `doctor_id`
- `visit_date`
- `complaint`
- `diagnosis`
- `notes`
- `created_at`

### `medications`
Fields:
- `id`
- `visit_id`
- `medicine_name`
- `dose`
- `frequency`
- `duration`
- `instructions`
- `created_at`

---

## 6. Security Requirements

- Enable RLS on application tables
- A doctor must only see their own patients
- A doctor must only see visits linked to their own patients
- A doctor must only see medicines linked to their own visits
- Never expose Supabase service-role or secret credentials in browser code
- Production secrets must not be available to Pull Request workflows

---

## 7. GitHub Workflow

Use a Pull Request workflow before code can be merged into `main`.

Required PR checks:

1. Install dependencies using the committed lockfile
2. Lint
3. Typecheck
4. Unit tests
5. Production build
6. Optional migration validation

Recommended commands:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

If any required check fails, the Pull Request should not be merged.

---

## 8. Branch Protection

Protect the `main` branch.

Recommended rules:
- Require a Pull Request before merging
- Require required status checks to pass
- Prevent direct pushes to `main`
- Require at least one approval if you want to practise team-style review
- Do not allow failed CI to be bypassed during normal practice

---

## 9. Supabase Migration Practice

All schema changes should be version-controlled.

Use:

```bash
supabase migration new <migration_name>
supabase migration list --linked
supabase db push --dry-run
supabase db push
```

Migration files should be committed to Git.

Do not make random production schema changes only from the Supabase dashboard during normal practice.

---

## 10. Vercel Environments

Use separate values for:

- Development
- Preview
- Production

Preview deployments should not use the production database by default.

Production environment variables should only be available to trusted production workflows and deployments.

---

## 11. Health Check

Create:

```text
/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

Use it after deployment to verify that the application is serving successfully.

Example:

```bash
curl --fail --silent --show-error https://your-domain.com/api/health
```

---

## 12. Suggested Next.js Structure

```text
clinicflow/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── PatientForm.tsx
│   ├── PatientSearch.tsx
│   ├── PatientDetails.tsx
│   ├── VisitForm.tsx
│   └── MedicationForm.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── supabase/
│   ├── migrations/
│   └── tests/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── production.yml
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── README.md
└── RUNBOOK.md
```

---

## 13. Hands-On Learning Rules

For this project:

- The learner performs all GitHub actions manually
- The learner creates and reviews Pull Requests
- The learner configures Supabase manually
- The learner creates migrations manually
- The learner configures RLS manually
- The learner configures Vercel manually
- The learner reads GitHub Actions logs manually
- The learner performs rollback practice manually

The assistant or coding agent should not perform production actions on the learner's behalf.

The assistant should only:
- Explain the next step
- Explain commands
- Review screenshots
- Review logs
- Diagnose failures
- Explain why a step is required
- Help the learner decide what to do next

---

## 14. Practice Milestones

### Milestone 1
Create the Next.js application and push it to GitHub.

### Milestone 2
Create Supabase project and authentication.

### Milestone 3
Create `patients`, `visits`, and `medications` migrations.

### Milestone 4
Add RLS and test doctor-level data isolation.

### Milestone 5
Build patient CRUD and visit/medicine recording.

### Milestone 6
Add GitHub Actions PR checks.

### Milestone 7
Enable branch protection.

### Milestone 8
Deploy Preview and Production on Vercel.

### Milestone 9
Add `/api/health` and post-deployment verification.

### Milestone 10
Intentionally create one failed PR, diagnose it, fix it, and merge it.

### Milestone 11
Practise one safe Vercel rollback.

---

## 15. Out of Scope

The first version should not include:

- Billing
- Insurance claims
- Appointment scheduling
- Pharmacy integration
- Laboratory integration
- File uploads
- AI diagnosis
- Complex reporting
- Multi-clinic administration
- Real patient deployment

Use synthetic or test patient data during practice.

---

## 16. Definition of Done

The project is complete when:

- Doctor authentication works
- Patients can be created and searched
- Visits can be saved
- Medicines can be attached to visits
- Previous visit history is visible
- Supabase RLS protects doctor-specific records
- Database schema is managed through migrations
- Pull Request checks run automatically
- Failed required checks block merge
- `main` is protected
- Vercel Preview and Production environments work
- `/api/health` works
- A rollback has been practised safely
- A basic `RUNBOOK.md` exists

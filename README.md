# JobQuest

JobQuest helps candidates manage job applications, resumes, and related career workflows in one place.

## Implementation authority

All implementation work must follow, in order:

1. Approved implementation decisions in [`docs/decisions/implementation-decisions.md`](docs/decisions/implementation-decisions.md)
2. The three finalized planning documents in `docs/planning/`:
   - `workflow-requirements-final.pdf` — Workflow and Requirements Review Plan
   - `developer-technology-plan-final.pdf` — Developer Feature and Technology Plan
   - `creative-ux-accessibility-performance-final.pdf` — Creative Direction, UX/UI, Accessibility and Performance Plan
3. The current phase-specific implementation prompt

If any of these sources contradict each other, **stop and report the contradiction**. Do not resolve conflicts silently or invent a compromise.

## Approved stack

- Node.js
- TypeScript
- Next.js (App Router)
- React
- Tailwind CSS
- DaisyUI
- Heroicons
- React Hook Form
- Zod
- Hookform Resolvers
- Auth.js / next-auth
- bcryptjs
- Mongoose
- Cloudinary
- Resend
- Vitest
- React Testing Library
- jest-dom
- Testing Library user-event
- Playwright
- ESLint
- Prettier
- npm

## Local installation

```bash
npm install
```

Copy `.env.example` to `.env.local` and provide values for each variable as they become required by later phases. Do not commit real secrets.

```bash
cp .env.example .env.local
```

## Development commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format:check
npm run typecheck
```

## Environment variables

Required variable names (values are not committed):

- `MONGODB_URI`
- `MONGODB_TEST_URI`
- `AUTH_SECRET`
- `RESEND_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PDF_EXTRACTOR_URL`
- `PDF_EXTRACTOR_API_KEY`

See `.env.example` for the tracked template (names only).

## Testing commands

```bash
npm run test
npm run test:watch
npm run test:e2e
```

Playwright browsers are not downloaded during Phase 1 scaffolding. Install them later with `npx playwright install` before running end-to-end tests.

## Implementation status

Steps 1–8 are not implemented yet. This repository currently contains the Phase 1 application scaffold only (tooling, dependencies, folder structure, and a scaffold-validation page).

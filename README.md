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

Create `.env.local` manually by copying `.env.example`, then supply values as later phases require them. Do not commit real secrets.

```bash
cp .env.example .env.local
```

## Environment separation

| Runtime         | Variable           | Expected MongoDB database |
| --------------- | ------------------ | ------------------------- |
| Development     | `MONGODB_URI`      | `jobquest_dev`            |
| Automated tests | `MONGODB_TEST_URI` | `jobquest_test`           |
| Production      | `MONGODB_URI`      | `jobquest`                |

Database selection rules:

- Application code must never silently substitute the production database for the test database.
- Automated tests must use `MONGODB_TEST_URI` only. If that variable is required and absent, tests fail safely.
- Never use production data during automated testing.
- Future service variables (`AUTH_SECRET`, Resend, Cloudinary, PDF extractor) are recognized names in `.env.example` but are not required until their features are implemented.

See also [`docs/development/backend-foundation.md`](docs/development/backend-foundation.md).

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

Tracked names only (values are not committed):

- `MONGODB_URI`
- `MONGODB_TEST_URI`
- `AUTH_SECRET`
- `RESEND_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PDF_EXTRACTOR_URL`
- `PDF_EXTRACTOR_API_KEY`

## Testing commands

```bash
npm run test
npm run test:watch
npm run test:e2e
```

Unit tests do not need a database.

Database integration tests are separate: they require `MONGODB_TEST_URI` and must be explicitly enabled with `RUN_DB_INTEGRATION_TESTS=1`. They never fall back to `MONGODB_URI`.

Playwright browsers are not downloaded during scaffolding. Install them later with `npx playwright install` before running end-to-end tests.

## Backend foundation notes

- **Ownership:** every future top-level private record includes `ownerId`; queries must remain owner-scoped.
- **Audit events:** append-only history records for consequential actions; written only through the audit service.
- **Logging:** structured server logs must redact passwords, tokens, secrets, cookies, API keys, and database URIs.
- Server environment, database, logging, and audit modules are server-only and must not be imported from Client Components.

## Implementation status

Steps 1–8 are not implemented yet. The repository currently contains:

- Phase 1 application scaffold
- Phase 2A shared design system and application shell
- Phase 2B shared backend and data-access foundation

Authentication, MongoDB feature models, Cloudinary, Resend, PDF extraction, and workflow features are not implemented yet.

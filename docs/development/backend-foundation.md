# JobQuest backend foundation

Concise notes for the Phase 2B shared server foundation. Feature scope remains defined by the finalized planning documents.

## Environment separation

| Runtime | Variable | Expected database |
| --- | --- | --- |
| Development | `MONGODB_URI` | `jobquest_dev` |
| Automated tests | `MONGODB_TEST_URI` | `jobquest_test` |
| Production | `MONGODB_URI` | `jobquest` |

Rules:

- Test code must never fall back to `MONGODB_URI`.
- Production data must never be used for automated testing.
- Create `.env.local` manually from `.env.example`. Do not commit secrets.
- Environment values are validated only when a server service needs them, so `npm run build` can succeed without local secrets.

## Ownership

Every future top-level private record includes `ownerId`. Reads, updates, and deletes must use owner-scoped filters. Trusted `ownerId` values come from authentication in a later phase — never from an untrusted request body alone.

## Errors, logging, and audit

- `AppError` provides stable codes and safe public messages for future route handlers.
- The structured logger redacts secrets, tokens, cookies, and credential-bearing URIs.
- `AuditEvent` is append-only through `writeAuditEvent`. Importing the model or service does not connect to MongoDB.

## Testing

- Unit tests do not require a database.
- Database integration tests require `MONGODB_TEST_URI` and an explicit `RUN_DB_INTEGRATION_TESTS=1` opt-in.
- Integration tests must not target `jobquest` or `jobquest_dev`.

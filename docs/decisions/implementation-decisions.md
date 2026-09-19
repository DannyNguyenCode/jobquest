# JobQuest Implementation Decisions

This file records approved implementation decisions and amendments made after the finalized planning documents.

## Decision precedence

1. Approved entries in this file
2. Finalized Workflow and Requirements Review Plan
3. Finalized Developer Feature and Technology Plan
4. Finalized Creative Direction, UX/UI, Accessibility and Performance Plan

If the finalized documents conflict, development must pause and request a decision rather than silently choosing one.

## Approved decisions

### Password-reset session invalidation

- Status: Approved
- Decision: Add `passwordChangedAt` to the User record.
- Behaviour: A successful password reset updates `passwordChangedAt`. Any JWT issued before that timestamp is rejected.
- Effect: Password resets invalidate all previously issued sessions.
- Infrastructure: No Redis or database-backed session collection is required.
- Supersedes: The Developer and Creative Plans where they state that password resets do not invalidate other sessions.
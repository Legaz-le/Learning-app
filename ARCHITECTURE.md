# Architecture

## Goal

Build the product as a modular monolith on top of Next.js App Router. Keep the codebase easy to ship now, while preserving clear boundaries so features can scale without turning the app into route-level spaghetti.

The current stack already points in this direction:

- Next.js for UI, routing, and server execution
- Clerk for authentication
- Neon/Postgres with Drizzle for persistence
- Stripe for billing
- Mux for video
- AI SDK / OpenAI for tutoring and learning support features

## System Shape

Use a layered structure with feature ownership.

```text
app/
  (marketing)/
  (student)/
  (teacher)/
  (admin)/
  api/

features/
  auth/
  courses/
  chapters/
  enrollments/
  progress/
  billing/
  video/
  ai/
  admin/

db/
  schema/
  migrations/
  index.ts

lib/
  auth/
  payments/
  video/
  ai/
  email/
  env.ts

server/
  permissions/
  transactions/
  audit/
```

## Layer Responsibilities

### `app/`

Owns route segments, layouts, loading states, route handlers, and page composition.

Rules:

- Keep pages thin.
- Fetch data through feature queries.
- Execute mutations through feature commands or server actions.
- Do not place business logic directly in route files.

### `features/`

Owns business logic by domain. Each feature should contain the rules for that part of the product.

Suggested internal shape:

```text
features/courses/
  queries.ts
  commands.ts
  validators.ts
  types.ts
  components/
```

Rules:

- `queries.ts` reads and shapes data for UI or API use.
- `commands.ts` performs mutations and enforces business rules.
- `validators.ts` parses external input.
- `types.ts` defines feature-level types and view models.
- Shared UI belongs here only when it is feature-specific.

### `db/`

Owns schema, relations, migrations, and the database client.

Rules:

- No business logic beyond persistence helpers.
- Split schema by domain instead of keeping one monolithic schema file.
- Use transactions for multi-step writes that must stay consistent.

Suggested schema layout:

```text
db/schema/
  users.ts
  courses.ts
  chapters.ts
  progress.ts
  billing.ts
  index.ts
```

### `lib/`

Owns infrastructure adapters and integration clients.

Examples:

- `lib/auth`: Clerk integration, session helpers
- `lib/payments`: Stripe client and checkout helpers
- `lib/video`: Mux client and upload helpers
- `lib/ai`: model access, prompt wrappers, AI guardrails
- `lib/email`: Resend or React Email integration
- `lib/env.ts`: validated environment access

Rules:

- Third-party APIs should be wrapped here.
- App routes and features should not call vendors directly when a shared adapter makes sense.

### `server/`

Owns cross-cutting server-only primitives.

Examples:

- permission checks
- transaction wrappers
- audit logging
- shared error mapping

## Domain Model

Start with the smallest domain model that can ship a real learning platform.

### Core Entities

- `users`
  - app user record keyed by Clerk user id
  - stores role and local profile fields

- `courses`
  - title, slug, description, status, teacher id, price

- `course_sections`
  - optional grouping and ordering layer for chapters

- `chapters`
  - title, description, course id, section id, position
  - Mux asset and playback fields
  - publish state
  - free preview flag

- `attachments`
  - downloadable files for courses or chapters

- `enrollments`
  - grants access to learning content

- `chapter_progress`
  - completion and playback state per user and chapter

- `purchases`
  - Stripe references, price, currency, status

- `categories`
  - discovery and filtering

### Optional Later Entities

- `course_reviews`
- `ai_sessions`
- `ai_messages`
- `audit_logs`

## Route Architecture

Group routes by surface area rather than by resource name.

### Public / Marketing

```text
app/(marketing)/
  page.tsx
  courses/page.tsx
  courses/[slug]/page.tsx
  pricing/page.tsx
```

### Student

```text
app/(student)/
  dashboard/page.tsx
  learn/[courseId]/[chapterId]/page.tsx
  search/page.tsx
```

### Teacher

```text
app/(teacher)/
  teacher/courses/page.tsx
  teacher/courses/[courseId]/page.tsx
  teacher/courses/[courseId]/chapters/[chapterId]/page.tsx
```

### Admin

```text
app/(admin)/
  admin/page.tsx
  admin/users/page.tsx
  admin/courses/page.tsx
```

### Webhooks

```text
app/api/webhooks/
  clerk/route.ts
  stripe/route.ts
  mux/route.ts
```

Rules:

- Keep webhooks isolated from page routes.
- Make webhook handlers idempotent.
- Treat webhook confirmation as the source of truth for side effects such as granting paid access.

## Authorization Model

Use role-based access control plus ownership checks.

### Roles

- `student`
- `teacher`
- `admin`

### Access Rules

- Students can access published content they are entitled to.
- Teachers can manage only their own courses and related chapters.
- Admins can access all records and moderation flows.
- Free preview chapters can be public-read only when the parent course is published.

Centralize this logic in server-only modules:

```text
lib/auth/session.ts
lib/auth/permissions.ts
server/permissions/
```

Rules:

- Never rely on hidden UI alone.
- Every protected mutation must verify role and ownership server-side.

## Data Flow

### Reads

Preferred flow:

1. Route or server component calls a feature query.
2. Query loads database data.
3. Query returns a view model shaped for the caller.

Rules:

- Do not leak raw database rows through the app when the UI needs a stable view model.
- Keep expensive joins and shaping logic out of route files.

### Writes

Preferred flow:

1. UI submits a form or action.
2. Input is parsed in `validators.ts`.
3. Mutation runs in `commands.ts`.
4. Permissions and business invariants are checked.
5. DB writes happen in a transaction when needed.
6. Side effects run after persistence.
7. Relevant pages or caches are revalidated.

Rules:

- Billing, enrollment, and publication workflows should be transaction-safe.
- Never grant paid access based only on a client redirect.

## Integration Boundaries

### Clerk

Use Clerk as the identity provider, but maintain a local `users` table for app roles and platform-specific metadata.

Patterns:

- sync user creation via webhook or lazy upsert on first authenticated request
- keep authorization decisions in local app code

### Stripe

Use Stripe Checkout for purchases.

Rules:

- create checkout sessions on the server
- persist external ids for reconciliation
- only mark purchases complete from Stripe webhook events

### Mux

Use Mux for teacher-uploaded video assets and playback.

Rules:

- creation and update logic lives in `lib/video`
- playback fields are stored on chapters
- publication may depend on media readiness

### AI

Keep AI features behind a single app boundary.

Possible v1 use cases:

- chapter summaries
- quiz generation
- study assistant
- chapter Q&A

Rules:

- do not scatter model calls across components
- define rate limits and usage boundaries early
- log prompts and outputs if quality review matters

## Engineering Rules

These rules are meant to keep the codebase maintainable:

- Route files stay thin.
- UI components do not import DB code.
- Feature modules own business rules.
- Vendor SDKs are wrapped behind `lib/*` adapters.
- Authorization is centralized.
- Webhooks are idempotent.
- Published state and content access are enforced server-side.
- Schema is split by domain, not left as a single catch-all file.

## Suggested Initial Schema

The first implementation pass should cover:

- `users`
- `courses`
- `course_sections`
- `chapters`
- `attachments`
- `enrollments`
- `chapter_progress`
- `purchases`
- `categories`

This is enough to support:

- teacher course creation
- chapter management
- student enrollment
- course consumption
- progress tracking
- paid access

## Delivery Phases

### Phase 1

Foundation:

- auth integration
- role model
- base schema
- teacher course CRUD
- chapter CRUD
- student learning flow
- progress tracking

### Phase 2

Commerce and media:

- Stripe checkout
- purchase reconciliation
- Mux upload and playback
- chapter publication workflow

### Phase 3

Platform features:

- analytics
- moderation
- reviews
- AI tutor and quiz features
- audit logging and operational tooling

## Immediate Refactors For This Repo

Based on the current repository state, the first structural improvements should be:

1. Replace the placeholder `db/schema.ts` with split schema files and a schema index.
2. Add `lib/env.ts` to validate required environment variables.
3. Move auth policy into dedicated helpers instead of keeping all behavior in `middleware.ts`.
4. Introduce `features/` for the first real domain, likely `courses`.
5. Replace the default starter homepage with a real route structure for marketing and dashboard surfaces.

## Non-Goals For Now

Do not split this into microservices yet.

Reasons:

- the product scope does not justify the operational cost
- Next.js server execution is enough for the current stack
- modular boundaries inside one codebase are sufficient for early growth

The right time to split services is after a concrete scaling or organizational pain appears, not before.

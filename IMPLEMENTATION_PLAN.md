# Implementation Plan

Tags: #plan #implementation #learning-app

## Objective

Ship the first usable version of the learning platform on the current stack:

- Next.js
- Clerk
- Drizzle + Neon/Postgres
- Stripe
- Mux

Target outcome for v1:

- teachers can create and manage courses
- students can enroll and consume content
- progress is tracked
- paid access is enforced

---

## Phase 0: Foundation

Goal: make the repository safe to build on.

- [ ] Add `lib/env.ts` for validated environment access
- [ ] Define required environment variables
- [ ] Replace placeholder `db/schema/*` files with real schema
- [ ] Update `db/index.ts` to use typed schema exports
- [ ] Generate first Drizzle migration
- [ ] Add seed strategy for local development
- [ ] Replace default homepage with a real app shell
- [ ] Add CI for `npm run lint` and `npm run build`

Definition of done:

- local development works with documented env vars
- schema and migrations are checked into the repo
- main branch can be protected with meaningful CI checks

---

## Phase 1: Authentication And Roles

Goal: establish user identity and authorization boundaries.

- [ ] Integrate Clerk in app layouts and protected routes
- [ ] Create local `users` table keyed by Clerk user id
- [ ] Define roles: `student`, `teacher`, `admin`
- [ ] Add user sync flow on first login or Clerk webhook
- [ ] Create centralized permission helpers
- [ ] Replace route-level auth logic with shared auth helpers

Definition of done:

- signed-in users have local app records
- role checks happen server-side
- protected routes are enforced consistently

---

## Phase 2: Core Course Domain

Goal: support course creation and publishing workflow.

### Schema

- [ ] `users`
- [ ] `courses`
- [ ] `course_sections`
- [ ] `chapters`
- [ ] `attachments`
- [ ] `categories`

### Feature work

- [ ] Create `features/courses`
- [ ] Add course validators, queries, and commands
- [ ] Add teacher course list page
- [ ] Add teacher create course flow
- [ ] Add teacher edit course flow
- [ ] Add slug generation strategy
- [ ] Add draft vs published course status

Definition of done:

- teacher can create a draft course
- teacher can edit course metadata
- course data is persisted and queryable

---

## Phase 3: Chapter Management

Goal: let teachers structure course content.

- [ ] Create `features/chapters`
- [ ] Add chapter create/edit/delete flows
- [ ] Add chapter ordering
- [ ] Add free preview flag
- [ ] Add publish validation rules
- [ ] Add section-based grouping if needed

Definition of done:

- teacher can build a full course outline
- chapters can be reordered
- publish rules prevent incomplete content from going live

---

## Phase 4: Student Learning Experience

Goal: let students discover and consume courses.

- [ ] Add public course catalog
- [ ] Add course details page
- [ ] Add dashboard for enrolled users
- [ ] Add chapter player page
- [ ] Add navigation between chapters
- [ ] Add locked-content handling for unauthorized users

Definition of done:

- students can browse published courses
- enrolled users can open course chapters
- non-entitled users cannot access paid content

---

## Phase 5: Enrollment And Progress

Goal: track access and learning state.

### Schema

- [ ] `enrollments`
- [ ] `chapter_progress`

### Feature work

- [ ] Create `features/enrollments`
- [ ] Create `features/progress`
- [ ] Mark chapter complete
- [ ] Track last viewed chapter
- [ ] Track optional playback position
- [ ] Calculate course completion percentage

Definition of done:

- enrollment grants learning access
- progress persists per user
- dashboard can show continue-learning state

---

## Phase 6: Billing

Goal: support paid courses safely.

### Schema

- [ ] `purchases`

### Feature work

- [ ] Create `features/billing`
- [ ] Add Stripe checkout session creation
- [ ] Store Stripe identifiers for reconciliation
- [ ] Add Stripe webhook handler
- [ ] Grant course access only from webhook-confirmed payment
- [ ] Add purchase history view if needed

Definition of done:

- user can purchase a course
- payment success creates access reliably
- refreshes and redirects do not bypass payment rules

---

## Phase 7: Video Pipeline

Goal: support hosted course video.

- [ ] Create `lib/video`
- [ ] Create `features/video`
- [ ] Add Mux asset creation flow
- [ ] Store Mux asset and playback ids on chapters
- [ ] Add Mux webhook handling
- [ ] Block publish when required video state is incomplete
- [ ] Render player in student chapter view

Definition of done:

- teacher can attach video to chapters
- published chapters have playable assets
- Mux state is synchronized with the app

---

## Phase 8: Admin Surface

Goal: support moderation and platform oversight.

- [ ] Create `features/admin`
- [ ] Add admin dashboard
- [ ] Add user listing and role management
- [ ] Add course moderation tools
- [ ] Add audit logging for sensitive mutations

Definition of done:

- admins can inspect users and courses
- sensitive changes are traceable

---

## Phase 9: AI Features

Goal: add AI only after the core product works.

- [ ] Create `lib/ai`
- [ ] Create `features/ai`
- [ ] Choose first AI feature:
  - [ ] chapter summary
  - [ ] quiz generation
  - [ ] study assistant
  - [ ] chapter Q&A
- [ ] Add usage limits
- [ ] Add prompt and output logging if quality review is needed

Definition of done:

- AI is behind a single integration boundary
- feature quality can be measured and refined

---

## Recommended Build Order

If implementation starts immediately, follow this order:

1. `lib/env.ts`
2. Drizzle schema
3. migrations
4. auth and roles
5. course CRUD
6. chapter CRUD
7. student course pages
8. enrollments and progress
9. Stripe billing
10. Mux video
11. admin tools
12. AI features

---

## Initial Milestone: First Vertical Slice

The first real milestone should be:

- [ ] teacher signs in
- [ ] teacher creates a course
- [ ] teacher adds chapters
- [ ] teacher publishes course
- [ ] student can view course detail page
- [ ] enrolled student can open and complete a chapter

This milestone matters because it proves the core domain before adding billing and media complexity.

---

## Risks

- [ ] environment setup remains informal
- [ ] auth logic stays too coupled to route files
- [ ] billing is implemented before access rules are solid
- [ ] video workflow is added before chapter publishing is stable
- [ ] AI is added too early and distracts from the core product

---

## Definition Of Production-Ready V1

- [ ] protected branches and CI are active
- [ ] schema and migrations are stable
- [ ] teachers can create and publish courses
- [ ] students can enroll and learn
- [ ] progress tracking works
- [ ] payment flow is reliable
- [ ] video playback works for published chapters
- [ ] admin oversight exists for critical operations

---

## Related Notes

- [[ARCHITECTURE]]
- [[BRANCH_PROTECTION]]

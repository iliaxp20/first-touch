---
name: first-touch-workflow
description: >-
  Standard end-to-end workflow for designing, building, and validating new features in First Touch
  (from database schema to API endpoint to responsive UI).
---

# First Touch Feature Development Workflow

Follow this 5-stage lifecycle for every feature implemented in the First Touch system.

---

## Stage 1: Specification & Domain Modeling
1. Identify the actors involved: **Coach**, **Student/Player**, or **Platform Admin**.
2. Define the data contracts in `packages/shared/src/types/`:
   - Request DTOs (e.g. `CreatePlanDto`, `UpdateTacticDto`).
   - Response DTOs & Domain entities.
3. If new persistence fields are required, update `apps/api/prisma/schema.prisma` and define foreign keys and indexes.

---

## Stage 2: Backend API Implementation (`apps/api`)
1. Create or extend the domain module under `apps/api/src/modules/<feature>/`:
   - `*.controller.ts`: Routing, OpenAPI/Swagger docs, guards (`@UseGuards(JwtAuthGuard, RolesGuard)`).
   - `*.service.ts`: Business logic, validation, transactional operations.
   - `dto/*.dto.ts`: Input validation with `class-validator` and `class-transformer`.
2. Ensure proper role authorization (e.g., only a `COACH` can create tactical drills or publish plans).
3. Write unit tests for service methods under `*.service.spec.ts`.

---

## Stage 3: Shared Types Export (`packages/shared`)
1. Export all relevant types and status enums so the frontend can import them directly.
2. Avoid type drift between frontend and backend.

---

## Stage 4: Frontend Implementation (`apps/web`)
1. Create the feature folder under `apps/web/src/features/<feature>/`:
   - `api/<feature>Api.ts`: Axios/Fetch calls typed with shared DTOs.
   - `hooks/use<Feature>.ts`: TanStack Query hooks (`useQuery`, `useMutation`) for cache invalidation.
   - `components/`: UI components adhering to Single Responsibility and Responsive/Dark-mode standards.
2. Implement loading skeletons, error states, and empty states.
3. Test responsiveness on:
   - Mobile viewport (`375px` - iPhone SE / 13)
   - Tablet viewport (`768px` - iPad)
   - Desktop viewport (`1280px`+)
4. Test both Light mode and Dark mode transitions.

---

## Stage 5: Verification & Review Checklist
- [ ] Are all types strictly defined (no `any`)?
- [ ] Does the UI adapt smoothly on mobile screens with touch-friendly elements?
- [ ] Are color classes semantic (no hardcoded white/black)?
- [ ] Is error handling user-friendly (toast alerts or inline errors)?
- [ ] Are database queries optimized with appropriate indexes?

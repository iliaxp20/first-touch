# First Touch (فرست تاچ) - Project Architecture & Engineering Guidelines

Welcome to the **First Touch** codebase. First Touch is a comprehensive football training & coaching management platform designed for coaches and trainees (players/students).

---

## 1. Core Engineering Principles (SOLID & Clean Code)

Every contributor and agent working on this codebase MUST adhere to these non-negotiable standards:

### S - Single Responsibility Principle (SRP)
- Every component, module, service, and hook must have **one and only one reason to change**.
- React: Split UI representation, state management, and business logic:
  - Container / Page components handle routing and query coordination.
  - Presentation components are pure, receiving data and callbacks via props.
  - Custom hooks (`use...`) encapsulate side-effects, data-fetching, and local logic.
- NestJS: Controllers only handle HTTP routing and DTO validation; Services handle domain business logic; Repositories/Prisma handle database queries.

### O - Open/Closed Principle (OCP)
- Modules and components must be **open for extension, closed for modification**.
- Use composition over inheritance: slot patterns (`children`, render props), pluggable strategies in backend services (e.g., payment providers).

### L - Liskov Substitution Principle (LSP)
- Derived types, service implementations, and subcomponents must be swappable without breaking expected behavior.

### I - Interface Segregation Principle (ISP)
- Avoid bloated interfaces. Prefer smaller, focused TypeScript types and interfaces:
  - E.g., pass `Pick<User, 'id' | 'name' | 'avatarUrl'>` instead of the whole `User` object to an avatar badge component.

### D - Dependency Inversion Principle (DIP)
- High-level modules must not depend on low-level modules; both depend on abstractions (interfaces / contracts).
- In NestJS, inject interfaces or abstract classes via dependency injection.
- In React, use Context or custom hook abstractions rather than hardcoded global singletons.

---

## 2. Folder Packaging & Modular Architecture (Feature-Driven)

We follow a **Feature-Driven Package Architecture** for both Frontend and Backend:

### Frontend (`apps/web/src`)
```
src/
├── assets/             # Static icons, images, pitch SVGs
├── components/         # Shared, generic UI components (Buttons, Inputs, Modals)
│   ├── layout/         # AppLayout, Navbar, Sidebar, MobileNav
│   └── ui/             # Atomic design components (shadcn/ui style)
├── context/            # Global contexts (ThemeContext, AuthContext)
├── features/           # Feature modules (self-contained!)
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── tactics/        # Tactical board, canvas tools, player positioning
│   │   ├── components/ # PitchCanvas, PlayerMarker, TacticsToolbar
│   │   ├── hooks/      # useTacticsCanvas, usePitchExport
│   │   ├── types/      # TacticItem, PitchFormation
│   │   └── api/        # tacticsApi.ts
│   ├── plans/          # Training programs, workout builder, exercises
│   └── subscriptions/  # Plan purchasing, invoices, payment status
├── hooks/              # Global reusable hooks (useMediaQuery, useDebounce)
├── lib/                # Utilities, axios instance, formatters
├── routes/             # App routing configuration
└── types/              # Global TypeScript declarations
```

### Backend (`apps/api/src`)
```
src/
├── common/             # Cross-cutting concerns: guards, interceptors, filters, decorators
├── config/             # Environment validation and config service
├── database/           # Prisma service and database connection
└── modules/            # Domain modules (NestJS Modules)
    ├── auth/           # Authentication & JWT strategy
    ├── users/          # User management (Coach & Student profiles)
    ├── plans/          # Training plan creation & assignment
    ├── tactics/        # Tactical boards saving & sharing
    └── subscriptions/  # Subscription tiers, payment gateways & billing cron
```

---

## 3. Dark / Light Theming Standards

- We use **Tailwind CSS** with CSS variables (`hsl(...)`) for dynamic theming.
- The `dark` class is attached to the `<html>` or `<body>` element.
- Every UI component MUST support both themes seamlessly:
  - Backgrounds: `bg-background dark:bg-background` (using semantic tokens: `bg-card`, `bg-muted`).
  - Text: `text-foreground`, `text-muted-foreground`.
  - Borders: `border-border`, `border-input`.
- A global `ThemeContext` provides `{ theme, setTheme, toggleTheme }` supporting `light`, `dark`, and `system` modes with `localStorage` persistence.

---

## 4. Responsive Design Standards (Mobile-First)

Coaches and trainees actively use mobile phones and tablets on the football pitch and in the gym:
- **Mobile-First Breakpoints**: Always write base styles for mobile screens `< 640px`, and scale up using `sm:`, `md:`, `lg:`, `xl:`.
- **Touch-Friendly**: Tap targets must be at least `44x44px` with comfortable spacing.
- **Collapsible Navigation**:
  - Desktop: Collapsible sidebar with labels and icons.
  - Mobile: Bottom navigation bar or top hamburger sheet drawer.
- **Canvas / Tactical Board**: Must support touch gestures (touch drag-and-drop, pinch zoom, responsive aspect ratio `16:9` or `4:3` pitch).

---

## 5. Clean Code Rules of Thumb
1. **Meaningful Naming**: Variables and functions must reveal intent (e.g., `isSubscriptionActive` instead of `flag`, `calculateWorkoutDurationMinutes` instead of `calc`).
2. **Early Returns**: Keep nesting under 2 levels; return early on validation failures or empty states.
3. **Strict Typing**: Never use `any`. Use generics, union types, or `unknown` with type guards.
4. **No Side Effects in Render**: React components must be pure during rendering; side effects belong in `useEffect` or event handlers.

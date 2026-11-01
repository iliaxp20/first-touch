---
name: clean-code-solid
description: >-
  Actionable guide for enforcing SOLID principles, clean code standards, and feature-driven
  packaging in First Touch (React + NestJS + PostgreSQL).
---

# Clean Code & SOLID Engineering Skill

This skill guides engineers and agents in developing maintainable, scalable, and testable code across the First Touch monorepo.

---

## 1. Practical SOLID Principles in First Touch

### Single Responsibility (SRP)
- **React Components**: If a component does data fetching, data formatting, AND renders complex DOM, it violates SRP.
  - *Correct Pattern*:
    ```typescript
    // 1. Hook encapsulates fetching & mutations
    export function usePlanDetails(planId: string) {
      return useQuery({ queryKey: ['plan', planId], queryFn: () => fetchPlan(planId) });
    }

    // 2. Pure UI component displays data
    export function PlanDetailsCard({ plan }: { plan: PlanDto }) {
      return (
        <Card className="p-4">
          <h3 className="text-lg font-bold">{plan.title}</h3>
          <p className="text-muted-foreground">{plan.description}</p>
        </Card>
      );
    }
    ```
- **NestJS Services**: Keep services focused on single domain entities. Split `UsersService`, `AuthService`, `CoachesService` instead of having one huge `UserManagerService`.

### Open/Closed (OCP)
- Implement strategy patterns for extensible components.
- For example, in payment gateway processing (`apps/api/src/modules/subscriptions`):
  ```typescript
  export interface PaymentGatewayStrategy {
    initiatePayment(amount: number, callbackUrl: string): Promise<PaymentSession>;
    verifyPayment(authority: string, amount: number): Promise<PaymentVerificationResult>;
  }

  // ZarinpalGateway, StripeGateway, etc. implement PaymentGatewayStrategy without altering PaymentService logic.
  ```

### Liskov Substitution (LSP)
- Derived classes or custom implementations must be substitutable for their base types without altering program correctness.

### Interface Segregation (ISP)
- Create small, purposeful interfaces rather than fat monoliths.
  ```typescript
  // Bad: Forces every component to know about subscription history and passwords
  interface FullUser { id: string; name: string; email: string; invoices: Invoice[]; passwordHash: string; }

  // Good: Granular contracts
  interface UserIdentity { id: string; name: string; avatarUrl?: string; }
  interface UserAccount extends UserIdentity { email: string; role: 'COACH' | 'STUDENT' | 'ADMIN'; }
  ```

### Dependency Inversion (DIP)
- Depend on abstractions, not concretions.
- In NestJS: Use injection tokens and interface abstractions so testing with mock repositories is effortless.

---

## 2. Clean Code Rules for Daily Work

1. **Function Size**: Keep functions short (< 30 lines where possible). A function should do one thing well.
2. **Descriptive Names**:
   - Variables: `traineesCount`, `hasCompletedDrill`, `activeTacticsBoard`.
   - Functions: `calculateTotalWorkoutsDuration()`, `filterPlansByDifficulty()`.
   - Boolean flags: Always start with `is`, `has`, `should`, or `can`.
3. **Avoid Primitive Obsession**: Create value objects or strict TypeScript types (e.g., `type Currency = 'IRR' | 'USD' | 'EUR'`, `type FootballPosition = 'GK' | 'DF' | 'MF' | 'FW'`).
4. **Error Handling**: Use domain-specific exceptions (e.g., `SubscriptionExpiredException`, `PlayerLimitReachedException`) rather than generic `500 Internal Error`.

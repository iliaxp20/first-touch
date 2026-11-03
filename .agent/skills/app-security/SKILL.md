---
name: app-security
description: >-
  Comprehensive guide and non-negotiable rules for Application Security, OWASP hardening,
  cryptographic JWT management, API protection, RBAC authorization, and defensive coding in First Touch.
---

# First Touch Application Security & Hardening Skill

This skill enforces strict, production-grade security standards across both the **React Frontend (`apps/web`)** and **NestJS Backend (`apps/api`)**. Every agent and developer writing or modifying code in this repository MUST strictly follow these rules.

---

## 1. Golden Rules of Security (Zero-Trust Model)

1. **Never trust client-side validation alone**: Always enforce strict DTO validation with `class-validator` and `class-transformer` on the backend (`whitelist: true`, `forbidNonWhitelisted: true`).
2. **Never trust React Protected Routes for actual security**: React routes are purely for UX/UI presentation. All data protection and mutation authorization MUST occur in backend Guards and Services.
3. **Never hardcode secrets, tokens, or passwords**: No API keys, admin passwords, or test backdoors (`12345`) in source files. All secrets reside in environment variables.
4. **Never return sensitive data in API responses**: Do not leak hashed passwords, OTP verification codes, database stack traces, or internal error objects.
5. **Enforce Least Privilege & RBAC**: Every state-changing endpoint (`POST`, `PUT`, `PATCH`, `DELETE`) requires `@UseGuards(JwtAuthGuard, RolesGuard)` with explicitly specified `@Roles(...)`.
6. **Prevent Broken Object Level Authorization (BOLA/IDOR)**: Always verify that the currently authenticated user (`@CurrentUser()`) owns the resource before allowing read, modification, or deletion.

---

## 2. Authentication & JWT Standards

### OTP Authentication
- OTP codes must be cryptographically generated using `crypto.randomInt(10000, 100000)`.
- Store only the bcrypt hash of the OTP in memory/cache (`expiresAt` <= 120 seconds).
- Strictly enforce a maximum of 3 failed attempts per OTP code, followed by automatic invalidation.
- Never output `testOtp` in production responses.
- Enforce a 60-second cooldown between consecutive OTP requests per phone number.

### Password Management
- Use `bcrypt` with a minimum salt round of 10 (or `argon2id`).
- Passwords must be at least 8 characters with required complexity (letters, numbers, special characters).
- Brute-force protection: Lock out identifiers (IP or username) for 15 minutes after 5 failed consecutive attempts.

### JWT Cryptography
- Tokens must be cryptographically signed using HS256/RS256 with high-entropy secret (`JWT_SECRET` >= 32 characters).
- Access tokens must have a short lifespan (`15m` to `2h`).
- Payload must only contain minimal necessary identifiers:
  ```typescript
  interface JwtPayload {
    sub: string;       // User ID
    role: Role;        // Verified Role
    phoneNumber?: string;
  }
  ```

---

## 3. API & Endpoint Security (NestJS)

### Security Headers & Middleware
- Use `helmet` globally with configured Content Security Policy (CSP), Frameguard (Clickjacking prevention), and X-Content-Type-Options (MIME sniffing prevention).
- Use strict CORS whitelisting:
  ```typescript
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS blocked by security policy'));
    },
    credentials: true,
  });
  ```
- Apply Rate Limiting globally with `@nestjs/throttler` (`ThrottlerGuard`).

### Error Sanitization
- Never leak internal database query errors or stack traces in production.
- Use `AllExceptionsFilter` (`apps/api/src/common/filters/http-exception.filter.ts`) to log errors internally while returning safe, localized error messages to clients.

---

## 4. Frontend Security (React + Vite)

### Storage & Sensitive Data
- Sensitive administrative credentials must never exist in frontend code.
- Store short-lived access tokens in memory or secure storage.
- Clean up all authentication tokens and session data on logout.

### Injection & XSS Defenses
- Never use `dangerouslySetInnerHTML` unless explicitly sanitized with a proven library (such as `DOMPurify`).
- Never use `eval()` or `new Function()`.
- Avoid open redirects: Validate all redirection target URLs against an internal whitelist.

---

## 5. Security Checklist for Every New Feature

- [ ] Does the new endpoint have a DTO with strict validation decorators (`@IsString()`, `@MinLength()`, etc.)?
- [ ] Is the endpoint guarded with `@UseGuards(JwtAuthGuard)` if it touches private data?
- [ ] If the endpoint requires specific roles (e.g. Coach/Admin), is `@Roles(...)` applied?
- [ ] Is there an ownership check ensuring user `A` cannot mutate user `B`'s resources?
- [ ] Does the endpoint have rate-limiting coverage?
- [ ] Are all database operations executed via parameterized Prisma queries (no raw concatenated SQL)?
- [ ] Is error handling clean and sanitized (no stack traces leaked to client)?

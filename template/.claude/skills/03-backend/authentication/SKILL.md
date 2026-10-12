---
name: authentication
description: Use for any change touching identity, tokens, permissions, roles, object-level access or security config. Implements or reviews authentication and authorization - login, sessions/JWT, OAuth2/OIDC, password handling, roles.
---

# Authentication & Authorization

Make sure only the right person can do the right thing to the right object.

<HARD-GATE>
Do NOT build your own crypto or auth protocol. Every change here goes through `security-audit`
and `senior-review` before merge.
</HARD-GATE>

## Anti-Pattern: "The UI Hides The Button"

Hiding an action in the UI is not authorization. Every request must be checked on the server,
including ownership of the specific object (IDOR is the most common bug).

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` (auth setup) and `.claude/references/security.md`
2. **Use the framework or IdP** - no custom protocol
3. **Credentials and sessions/tokens** per the rules below
4. **Authorization** - deny by default; role **and** ownership on every request
5. **Abuse protection** - rate limits, generic errors, CSRF
6. **Tests** - the required set below

## The Process

- **Framework:** Spring Security, ASP.NET Identity, Passport/Auth.js, Django auth, or an IdP via
  OIDC (Authorization Code + PKCE).
- **Passwords:** argon2id or bcrypt (cost >= 12). Never log, return or store plaintext.
- **Sessions:** HttpOnly, Secure, SameSite cookies; rotate the id on login; server-side
  invalidation on logout.
- **JWT:** verify signature, `alg` allow-list, `iss`, `aud`, `exp`, `nbf`; short-lived access
  tokens; rotate refresh tokens; no secrets or personal data in claims; never accept `alg: none`.
- **Authorization:** enforce in the service layer, not only the UI or route.
- **Abuse:** rate-limit login/reset endpoints; generic error messages ("invalid credentials");
  CSRF protection for cookie-based auth.
- **Secrets:** from env or a secret store only.
- **Tests required:** unauthenticated -> 401, wrong role -> 403, other user's object -> 403/404,
  expired/tampered token -> 401, happy path.

## Key Principles

- Framework, never custom crypto
- Deny by default
- Role and ownership on every request
- Generic errors, rate-limited endpoints

## Transition

`@reviewer` (with `security-audit`), then `@senior-reviewer` (mandatory) - `/review` runs both.

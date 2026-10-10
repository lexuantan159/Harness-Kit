---
name: authentication
description: Implement or review authentication and authorization - login, sessions/JWT, OAuth2/OIDC, password handling, roles and object-level access. Use for any change touching identity, tokens, permissions or security config.
---

# Authentication & authorization

Changes here always get `senior-reviewer` and `security-audit`.

## Rules
- Do not build your own crypto or auth protocol. Use the framework (Spring Security, ASP.NET
  Identity, Passport/Auth.js, Django auth) or an IdP via OIDC (Authorization Code + PKCE).
- Passwords: argon2id or bcrypt (cost >= 12). Never log, return or store plaintext.
- Sessions: HttpOnly, Secure, SameSite cookies; rotate id on login; server-side invalidation on logout.
- JWT: verify signature, `alg` allow-list, `iss`, `aud`, `exp`, `nbf`; short-lived access tokens,
  rotate refresh tokens; never put secrets/personal data in claims; never accept `alg: none`.
- Authorization: deny by default; check role **and** ownership of the specific object on every
  request (IDOR is the most common bug); enforce in the service layer, not only the UI.
- Rate-limit login/reset endpoints; generic error messages ("invalid credentials").
- Secrets from env/secret store only. CSRF protection for cookie-based auth.

## Tests required
Unauthenticated -> 401, wrong role -> 403, other user's object -> 403/404, expired/tampered
token -> 401, happy path.

# Security Checklist

Quick reference for application security. Used by the `security-audit` skill, `reviewer` and
`pr-review`. Based on OWASP Top 10 / ASVS. Code examples are TypeScript; apply the same rule in
the project's own stack.

## Table of Contents

- [Pre-Commit Checks](#pre-commit-checks)
- [Input Validation & Injection](#input-validation--injection)
- [Authentication & Sessions](#authentication--sessions)
- [Authorization](#authorization)
- [Data Protection](#data-protection)
- [Security Headers](#security-headers)
- [CORS Configuration](#cors-configuration)
- [Error Handling](#error-handling)
- [Configuration & Dependencies](#configuration--dependencies)
- [OWASP Top 10 Quick Reference](#owasp-top-10-quick-reference)

## Pre-Commit Checks

- [ ] No secrets in the diff (`git diff --cached | grep -iE "password|secret|token|api[_-]?key|BEGIN .*PRIVATE"`)
- [ ] `.gitignore` covers `.env`, `.env.local`, `*.pem`, `*.key`, `mcp/.env`
- [ ] `.env.example` uses placeholder values, never real secrets

## Input Validation & Injection

- [ ] All external input validated at the boundary (API routes, form handlers, message consumers)
- [ ] Validation uses allow-lists, not deny-lists
- [ ] String lengths (min/max), numeric ranges and formats (email, URL, date) checked with proper libraries
- [ ] SQL/NoSQL via parameters or ORM; no string-built queries
- [ ] No shell commands built from input; if unavoidable, argument arrays + allow-list
- [ ] File paths normalised and confined to a base directory; uploads restricted by type, size
      and verified content
- [ ] Output encoded for its context (HTML, attribute, JS, URL); templates auto-escape
- [ ] No unsafe deserialisation (Java native, pickle, YAML load) of untrusted data
- [ ] Redirect targets validated (no open redirect)
- [ ] Outbound URLs from input checked against an allow-list (SSRF)

## Authentication & Sessions

- [ ] Framework/IdP auth, no custom crypto
- [ ] Passwords hashed with argon2id, scrypt or bcrypt (>= 12 rounds)
- [ ] Tokens verified (signature, alg, iss, aud, exp); short-lived; revocable
- [ ] Session cookies `HttpOnly`, `Secure`, `SameSite=Lax` (or stricter), with a reasonable max-age
- [ ] CSRF protection for cookie-based auth
- [ ] Login and reset rate-limited (<= 10 attempts per 15 minutes); generic error messages
- [ ] Password reset tokens time-limited (<= 1 hour) and single-use
- [ ] Optional: account lockout with notification; MFA for sensitive operations

## Authorization

- [ ] Every endpoint has an explicit rule; deny by default
- [ ] Every resource access checks ownership/role server-side (no IDOR)
- [ ] Admin endpoints verify the admin role
- [ ] No trust in client-supplied role / userId / price / tenant
- [ ] API keys scoped to the minimum necessary permissions

## Data Protection

- [ ] No secrets in code, config, tests, logs, error messages or commits
- [ ] Sensitive fields excluded from API responses (`passwordHash`, `resetToken`, ...)
- [ ] Personal data minimised in responses and masked in logs; never log passwords, tokens or
      full card numbers
- [ ] PII encrypted at rest where regulation requires it; backups encrypted
- [ ] TLS for all external communication; certificate verification never disabled
- [ ] Sensitive responses `Cache-Control: no-store`

## Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY            (or CSP frame-ancestors 'none')
X-XSS-Protection: 0              (disabled, rely on CSP)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## CORS Configuration

```typescript
// Restrictive (recommended)
cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// NEVER in production - and never `*` together with credentials:
cors({ origin: '*' })
```

## Error Handling

```typescript
// Production: generic error, no internals
res.status(500).json({
  error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
});

// NEVER in production:
res.status(500).json({
  error: err.message,
  stack: err.stack,  // exposes internals
  query: err.sql,    // exposes database details
});
```

Log the full error server-side (without secrets or personal data) with a correlation ID, and
return only that ID to the client.

## Configuration & Dependencies

- [ ] Debug, actuator and admin endpoints not publicly exposed; debug mode off in production
- [ ] Dependencies free of known high/critical CVEs; versions pinned; no abandoned packages

```bash
npm audit --audit-level=high                      # Node; `npm audit fix` where safe
mvn org.owasp:dependency-check-maven:check         # Java (Maven)
pip-audit                                          # Python
```

## OWASP Top 10 Quick Reference

| # | Vulnerability | Prevention |
|---|---|---|
| 1 | Broken Access Control | Auth checks on every endpoint, ownership verification, deny by default |
| 2 | Cryptographic Failures | TLS, strong password hashing, no secrets in code |
| 3 | Injection | Parameterised queries, input validation, output encoding |
| 4 | Insecure Design | Threat modelling, spec-driven development |
| 5 | Security Misconfiguration | Security headers, minimal permissions, debug off |
| 6 | Vulnerable Components | Dependency audit, pinned versions, minimal dependencies |
| 7 | Identification & Auth Failures | Strong hashing, rate limiting, session management |
| 8 | Software & Data Integrity Failures | Verify updates and dependencies, signed artifacts, safe deserialisation |
| 9 | Logging & Monitoring Failures | Log security events, never log secrets |
| 10 | SSRF | Allow-list outbound URLs, restrict outbound requests |

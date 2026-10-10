# Security checklist

Used by `security-audit`, `reviewer` and `pr-review`. Based on OWASP Top 10 / ASVS.

## Input & injection
- [ ] All external input validated (type, length, format, range) at the boundary
- [ ] SQL/NoSQL via parameters or ORM; no string-built queries
- [ ] No shell commands built from input; if unavoidable, argument arrays + allow-list
- [ ] File paths normalised and confined to a base directory; upload type/size checked
- [ ] Output encoded for its context (HTML, attribute, JS, URL); templates auto-escape
- [ ] No unsafe deserialisation (Java native, pickle, YAML load) of untrusted data
- [ ] Outbound URLs from input checked against an allow-list (SSRF)

## Authentication & sessions
- [ ] Framework/IdP auth, no custom crypto; passwords hashed with argon2id/bcrypt
- [ ] Tokens verified (signature, alg, iss, aud, exp); short-lived; revocable
- [ ] Cookies HttpOnly, Secure, SameSite; CSRF protection for cookie auth
- [ ] Login/reset rate-limited; generic error messages

## Authorization
- [ ] Every endpoint has an explicit rule; deny by default
- [ ] Object-level ownership checked server-side (no IDOR)
- [ ] No trust in client-supplied role/userId/price/tenant

## Data protection
- [ ] No secrets in code, config, tests, logs, error messages or commits
- [ ] Personal data minimised in responses and masked in logs
- [ ] TLS everywhere; certificate verification never disabled
- [ ] Sensitive responses `Cache-Control: no-store`

## Configuration & dependencies
- [ ] Security headers (CSP, HSTS, X-Content-Type-Options, frame-ancestors)
- [ ] CORS restricted; never `*` with credentials
- [ ] Debug/actuator/admin endpoints not publicly exposed
- [ ] Dependencies free of known high/critical CVEs; versions pinned

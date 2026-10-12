---
name: security-audit
description: Security review of code or a diff against OWASP Top 10 and project rules - injection, authz, secrets, crypto, dependencies, data exposure. Use for changes touching auth, input handling, files, payments, personal data, or before release.
---

# Security audit

Use `.claude/references/security.md` as the checklist. Report only verified issues with a
concrete exploit scenario.

1. **Map trust boundaries** - where untrusted input enters (HTTP, files, messages, headers, env)
   and where it reaches sinks (SQL, shell, file paths, HTML, templates, deserializers, URLs/SSRF, logs).
2. **Injection** - parameterised queries, no string-built commands, path normalisation, safe
   deserialisation, output encoding, SSRF allow-lists.
3. **AuthN/AuthZ** - every endpoint protected as intended; object-level ownership checks; no
   privilege from client-supplied fields (`role`, `userId`, `price`).
4. **Secrets** - none in code, config, tests, logs or error messages; scan the diff
   (`git diff | grep -iE "password|secret|token|api[_-]?key|BEGIN .*PRIVATE"`).
5. **Data exposure** - responses return only needed fields; personal data masked in logs;
   proper cache headers.
6. **Crypto** - standard libraries, no MD5/SHA1 for passwords, secure random for tokens, TLS verify on.
7. **Dependencies** - known CVEs (`npm audit`, `mvn org.owasp:dependency-check-maven:check`,
   `pip-audit`); unpinned or abandoned packages.
8. **Config** - security headers, CORS not `*` with credentials, debug off, error details hidden.

Output: severity (Critical/High/Medium/Low), path:line, scenario, fix.

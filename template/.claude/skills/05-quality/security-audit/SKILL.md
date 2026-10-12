---
name: security-audit
description: Use for changes touching auth, input handling, files, payments, personal data, or before release. Security review of code or a diff against OWASP Top 10 and project rules - injection, authz, secrets, crypto, dependencies, data exposure.
---

# Security Audit

Find exploitable weaknesses in code or a diff and report each with a concrete exploit scenario.
Checklist: `.claude/references/security.md`.

<HARD-GATE>
Do NOT run exploits, scanners or load against shared, staging or production systems. Demonstrate
findings by reading code and with local tests only. Never print secrets you find - report the
file and line.
</HARD-GATE>

## Anti-Pattern: "Checklist Theatre"

Listing every OWASP category without evidence buries the real issues. Report only verified
issues with a scenario an attacker could actually follow.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` for entry points and auth setup
2. **Map trust boundaries** - where untrusted input enters and which sinks it reaches
3. **Injection**
4. **AuthN/AuthZ**
5. **Secrets**
6. **Data exposure**
7. **Crypto**
8. **Dependencies**
9. **Config**
10. **Report** verified findings

## The Process

- **Trust boundaries:** input from HTTP, files, messages, headers, env; sinks are SQL, shell,
  file paths, HTML, templates, deserializers, URLs (SSRF), logs.
- **Injection:** parameterised queries, no string-built commands, path normalisation, safe
  deserialisation, output encoding, SSRF allow-lists.
- **AuthN/AuthZ:** every endpoint protected as intended; object-level ownership checks; no
  privilege from client-supplied fields (`role`, `userId`, `price`).
- **Secrets:** none in code, config, tests, logs or error messages; scan the diff
  (`git diff | grep -iE "password|secret|token|api[_-]?key|BEGIN .*PRIVATE"`).
- **Data exposure:** responses return only needed fields; personal data masked in logs; proper
  cache headers.
- **Crypto:** standard libraries, no MD5/SHA1 for passwords, secure random for tokens, TLS verify on.
- **Dependencies:** known CVEs (`npm audit`, `mvn org.owasp:dependency-check-maven:check`,
  `pip-audit`); unpinned or abandoned packages.
- **Config:** security headers, CORS not `*` with credentials, debug off, error details hidden.

**Output:** severity (Critical/High/Medium/Low), path:line, scenario, fix.

## Key Principles

- Verified issues only, each with an exploit scenario
- Deny by default
- Never trust client-supplied identity or price
- Local evidence only; never touch shared systems

## Transition

Findings feed the reviewer's Issue List (Critical/High -> Critical, Medium -> Important,
Low -> Suggestion); in `/pr-review` Critical/High count as MUST-FIX, Medium as SHOULD-FIX, Low as
NIT. Changes on the `senior-review` mandatory list also go to `@senior-reviewer`.

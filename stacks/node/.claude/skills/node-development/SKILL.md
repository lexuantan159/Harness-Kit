---
name: node-development
description: Node.js / TypeScript conventions - package manager, module system, async patterns, validation, testing with Vitest/Jest. Use for any Node or TypeScript backend/tooling change in this project.
---

# Node / TypeScript development

## Tooling
- Use the package manager the lock file says (`package-lock.json` npm, `pnpm-lock.yaml` pnpm,
  `yarn.lock` yarn, `bun.lockb` bun). Never mix; never delete the lock file.
- Respect `engines` / `.nvmrc`. Run scripts via the package manager (`npm run test`).
- New dependencies need approval; prefer Node built-ins (`fetch`, `node:test`, `crypto.randomUUID`, `fs/promises`).

## Code
- Match the module system (ESM `import` vs CommonJS `require`) and TS `strict` settings.
- `async/await` everywhere; no floating promises; `Promise.all` for independent work; timeouts
  (`AbortSignal.timeout`) on outbound calls.
- Validate external input with the project's schema lib (zod, joi, class-validator).
- Types: no `any` (use `unknown` + narrowing); types at module boundaries, inference inside.
- Errors: throw `Error` subclasses; central error middleware; handle `unhandledRejection` by
  logging and exiting.
- Config from env, validated at startup.

## Tests
Vitest/Jest/node:test as configured; supertest for HTTP; fake timers for time; no real network.

## Pitfalls
Blocking the event loop (sync fs/crypto in request path), `==`, mutating shared module state,
forgetting `await` in try/catch, leaking stack traces in responses.

# Testing patterns

## Structure
- Arrange / Act / Assert; one behaviour per test; descriptive names
  (`returns404WhenOrderBelongsToAnotherUser`).
- Builders / factories with defaults: `anOrder().withStatus(PAID).build()`.

## Test doubles
| Double | Use for |
|---|---|
| Fake | In-memory repo, fake clock - preferred |
| Stub | Fixed answers from a dependency |
| Mock | Verifying an interaction that *is* the behaviour (email sent) |
| Spy | Rarely; legacy code seams |
Mock at architectural boundaries only (HTTP clients, message brokers, clocks).

## Determinism
- Inject clocks (`Clock`, `freezegun`, fake timers); seed randomness.
- No network; containers (Testcontainers) for real DB/queue behaviour.
- Wait for conditions (Awaitility, `waitFor`), never `sleep`.
- Each test sets up and cleans its own data; tests run in any order and in parallel.

## What to cover per behaviour
Happy path, boundaries (0, 1, max, empty, null), invalid input, permission denied, dependency
failure/timeout, idempotency/retry where relevant.

## Smells
Testing private methods, asserting on log output, giant shared fixtures, one test asserting ten
things, tests that pass when the code is deleted.

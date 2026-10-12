# Testing Patterns

Quick reference for writing reliable tests. Used by the `test-driven-development` and
`testing-strategies` skills, `tester`, `reviewer` and `pr-review`. Code examples are TypeScript
(Vitest/Jest); apply the same pattern with JUnit, pytest or the project's framework.

## Table of Contents

- [Structure](#structure)
- [Test Data](#test-data)
- [Test Doubles](#test-doubles)
- [Determinism](#determinism)
- [What to Cover](#what-to-cover)
- [Smells](#smells)
- [Smell Quick Reference](#smell-quick-reference)

## Structure

- [ ] Arrange / Act / Assert; one behaviour per test
- [ ] Descriptive names that state scenario and outcome
      (`returns404WhenOrderBelongsToAnotherUser`)
- [ ] Tested through the public interface, not private methods

```typescript
it('rejects an order when stock is insufficient', async () => {
  // Arrange
  const inventory = new FakeInventory({ 'SKU-1': 1 });
  const service = new OrderService(inventory);
  // Act
  const result = service.place(anOrder().withItem('SKU-1', 2).build());
  // Assert
  await expect(result).rejects.toThrow(InsufficientStock);
});
```

## Test Data

- [ ] Builders / factories with sensible defaults; each test overrides only what matters
- [ ] Each test creates its own data; no shared mutable fixtures
- [ ] No production data

```typescript
// anOrder().withStatus('PAID').build()
export const anOrder = () => {
  const order: Order = { id: 'o-1', status: 'NEW', items: [] };
  const builder = {
    withStatus: (status: Status) => ((order.status = status), builder),
    withItem: (sku: string, qty: number) => (order.items.push({ sku, qty }), builder),
    build: () => structuredClone(order),
  };
  return builder;
};
```

## Test Doubles

| Double | Use for |
|---|---|
| Fake | In-memory repo, fake clock - preferred |
| Stub | Fixed answers from a dependency |
| Mock | Verifying an interaction that *is* the behaviour (email sent) |
| Spy | Rarely; legacy code seams |

- [ ] Mock at architectural boundaries only (HTTP clients, message brokers, clocks)
- [ ] Real objects inside the module under test

```typescript
// The email IS the behaviour, so verifying the interaction is right here
const mailer = { send: vi.fn() };
await new SignupService(mailer, new InMemoryUsers()).register('a@example.com');
expect(mailer.send).toHaveBeenCalledWith(expect.objectContaining({ to: 'a@example.com' }));
```

## Determinism

- [ ] Clocks injected (`Clock`, `freezegun`, fake timers); randomness seeded
- [ ] No network; containers (Testcontainers) for real DB/queue behaviour
- [ ] Wait for conditions (Awaitility, `waitFor`), never `sleep`
- [ ] Each test sets up and cleans its own data; tests run in any order and in parallel

```typescript
// Fake time instead of real time
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-31T23:59:00Z'));

// Wait for a condition instead of sleeping
await waitFor(() => expect(screen.getByText('Saved')).toBeVisible());
```

## What to Cover

For each behaviour:

- [ ] Happy path
- [ ] Boundaries: 0, 1, max, empty, null
- [ ] Invalid input
- [ ] Permission denied
- [ ] Dependency failure / timeout
- [ ] Idempotency / retry where relevant

## Smells

Testing private methods, asserting on log output, giant shared fixtures, one test asserting ten
things, tests that pass when the code is deleted.

## Smell Quick Reference

| Smell | Why it hurts | Fix |
|---|---|---|
| Testing private methods | Breaks on every refactor | Test through the public interface |
| Asserting on log output | Couples tests to wording | Assert on the observable outcome |
| Giant shared fixture | Hidden coupling, order dependence | Builders; each test creates its data |
| One test, ten assertions | First failure hides the rest | One behaviour per test |
| `sleep` in tests | Slow and still flaky | Wait for a condition |
| Mocking everything | Tests the mocks, not the code | Fakes; mock only at boundaries |
| Passes when code is deleted | Asserts nothing meaningful | Watch it fail first (TDD red) |
| Real time / network | Flaky across machines and days | Inject clocks, use containers or fakes |

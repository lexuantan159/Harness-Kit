---
name: test-driven-development
description: Use when adding or changing behaviour in a project with a test suite, before writing implementation code. Red-green-refactor - write a failing test, make it pass with minimal code, then clean up.
---

# Test-Driven Development

Let tests drive the design: each behaviour starts as a failing test.

<HARD-GATE>
Do NOT write production code for a behaviour until a test for it exists and you have watched it
fail for the expected reason. If the project has no test suite, say so and ask how to verify
instead.
</HARD-GATE>

## Anti-Pattern: "I'll Add The Tests After"

Tests written after the code tend to test the implementation that exists, not the behaviour that
was required, and they never get to prove they can fail.

## Checklist

1. **Context** - find the test conventions (location, naming, fixtures, command in CLAUDE.md)
2. **List behaviours** as short sentences, one per test
3. **Red** - write the next test; run it; watch it fail for the expected reason
4. **Green** - the simplest code that passes
5. **Refactor** - with all tests green
6. Repeat from step 3 for the next behaviour

## The Process

- **Red:** copy the closest existing test as a template. A compile error is not "red" - make it
  compile, then see the assertion fail.
- **Green:** hard-coding is fine if the next test will force generalisation.
- **Refactor:** remove duplication and improve names; behaviour and tests do not change.
- **Good tests:**
  - test behaviour through public interfaces, not private methods or call counts
  - Arrange / Act / Assert, one behaviour per test, the name says scenario and outcome
    (`rejectsOrderWhenStockIsInsufficient`)
  - deterministic: no real time, randomness, network or shared state - inject clocks and fakes
  - mock only at architectural boundaries (external services); prefer real objects inside
- **Bugs:** a bug fix starts with a regression test that fails first (`bug-fixing`).

See `.claude/references/testing-patterns.md`.

## Key Principles

- Never skip red
- Simplest code that passes
- Refactor only on green
- One behaviour per test

## Transition

Continue with the next plan step (`incremental-implementation`). When the step is done, the
verify command runs (`@tester` in `/code`).

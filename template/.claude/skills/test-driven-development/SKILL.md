---
name: test-driven-development
description: Red-green-refactor - write a failing test for the behaviour, make it pass with minimal code, then clean up. Use when adding or changing behaviour in a project with a test suite.
---

# Test-driven development

1. **List behaviours** to implement as short sentences (one per test).
2. **Red** - write the next test, using the project's conventions (location, naming, fixtures).
   Run it and watch it fail *for the expected reason*.
3. **Green** - the simplest code that passes. Hard-coding is fine if the next test will force
   generalisation.
4. **Refactor** - remove duplication, improve names, with all tests green. Then the next behaviour.

## Good tests
- Test behaviour through public interfaces, not private methods or call counts.
- Arrange / Act / Assert, one behaviour per test, name says the scenario and outcome
  (`rejectsOrderWhenStockIsInsufficient`).
- Deterministic: no real time, randomness, network or shared state - inject clocks and fakes.
- Mock only at architectural boundaries (external services), prefer real objects inside.

## Bugs
Bug fix = a regression test that fails first (`bug-fixing`).

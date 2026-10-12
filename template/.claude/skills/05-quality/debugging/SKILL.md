---
name: debugging
description: Use for any bug, crash, flaky test or "it doesn't work", before changing code. Systematic debugging - reproduce, isolate, hypothesise, confirm with evidence - ending in a root cause with file:line.
---

# Debugging

Find the root cause of a defect with evidence, so the fix addresses the cause and not the symptom.

<HARD-GATE>
Do NOT change production code to "try a fix" until you have a root cause backed by evidence
(a reproduction, a confirmed hypothesis, a file:line). Temporary assertions or logging to test a
hypothesis are allowed and must be removed afterwards.
</HARD-GATE>

## Anti-Pattern: "Let Me Just Try This"

Changing code until the error disappears hides the defect and often moves it. So do catching and
ignoring the exception, "fixing" the test instead of the code, and blaming flakiness without
evidence.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` for the flow you are debugging
2. **Reproduce** - exact steps, input, environment, expected vs actual
3. **Read the evidence** - error, stack trace, logs, recent changes
4. **Isolate** - shrink the input and the code path
5. **Hypothesise** - 2-3 candidate causes, each with a prediction
6. **Test each hypothesis** - one change at a time
7. **Root cause** - the defect in code/data/config, with file:line
8. **Hand over** to `bug-fixing`

## The Process

- **Reproduce:** turn it into a failing test or script if at all possible. Can't reproduce ->
  gather logs/traces and say so explicitly; do not guess.
- **Evidence:** read the full error message and stack trace (the first "caused by" from your
  code), logs around the timestamp, and recent changes (`git log -p --since`, `git bisect` for
  regressions).
- **Isolate:** binary-search the code path; remove variables one at a time (config, data,
  concurrency, environment).
- **Hypothesise:** for each candidate cause, write what you would observe if it were true.
- **Test:** add a targeted assertion, log line or breakpoint; run; compare with the prediction.
- **Root cause:** keep asking "why" until you reach the defect, not the place it surfaced.

## Key Principles

- Evidence over intuition - every conclusion cites a test run, log line or file:line
- One change at a time
- Root cause, not symptom
- Remove temporary logging before handing over

## Transition

Hand over to the `bug-fixing` skill with: repro, root cause (file:line), evidence, blast radius.
In `/fix` this is `@researcher`'s report in `docs/research/<ticket-or-slug>.md`.

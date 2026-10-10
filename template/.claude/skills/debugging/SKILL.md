---
name: debugging
description: Systematic debugging - reproduce, isolate, hypothesise, confirm with evidence, find the root cause. Use for any bug, crash, flaky test or "it doesn't work", before changing code.
---

# Debugging

1. **Reproduce** - exact steps, input, environment, expected vs actual. Turn it into a failing
   test or script if at all possible. Can't reproduce -> gather logs/traces and say so.
2. **Read the evidence** - full error message and stack trace (the first "caused by" from your
   code), logs around the timestamp, recent changes (`git log -p --since`, `git bisect` for regressions).
3. **Isolate** - shrink the input, binary-search the code path, remove variables (config, data,
   concurrency, environment).
4. **Hypothesise** - list 2-3 candidate causes. For each, predict what you'd observe if true.
5. **Test the hypothesis** - add a targeted assertion/log/breakpoint, run, compare to prediction.
   One change at a time. Remove temporary logging afterwards.
6. **Root cause** - keep asking "why" until you reach the defect in code/data/config, not the symptom.
7. **Hand over** to `bug-fixing` with: repro, root cause (file:line), evidence, blast radius.

Anti-patterns: changing code until the error disappears; catching and ignoring the exception;
"fixing" the test instead of the code; blaming flakiness without evidence.

---
name: ponytail
description: Use when deciding how much code to write, reviewing for over-engineering, or when the user runs /ponytail. Minimal-code discipline - YAGNI, reuse, stdlib, existing dependency, then new code. Always active via hooks.
---

# Ponytail - write less code

The best code is the code you did not have to write.

<HARD-GATE>
Do NOT add a new dependency without the user's approval, in every mode.
</HARD-GATE>

## Anti-Pattern: "We Might Need It Later"

Speculative abstractions, options and layers cost reading time today and are usually wrong about
tomorrow.

## Checklist

Climb the ladder and stop at the first rung that works:

1. **YAGNI** - is this needed for the task in front of you? If not, don't write it
2. **Reuse** - search the codebase for an existing function, component, util or pattern
3. **Stdlib / framework** - the language or framework already does it
4. **Existing dependency** - a library already in the build file does it
5. **New code** - smallest, plainest version

## The Process

**Smells to remove**
- An interface/abstract class with one implementation and no second one planned in this task.
- Config flags, parameters or options nobody asked for.
- Generic helper/util used once. Inline it.
- Defensive checks for states the type system or caller already rules out.
- Layers that only forward calls. Wrapper classes around a library with no added behaviour.
- Code made unused by your change - delete it.

**Modes** - set with `/ponytail <mode>`; stored in `.claude/.ponytail-active` (git-ignored); shown
in the status line.

| Mode | Effect |
|---|---|
| off | No extra rules |
| lite | Prefer minimal code |
| full | Hard rule (default; override with env `PONYTAIL_DEFAULT_MODE`) |
| strict | Full + justify every new function, file or dependency |

## Key Principles

- Stop at the first rung that works
- Delete code your change made unused
- Tests, input validation at system boundaries, error handling the caller needs and security
  controls are not "extra code"

## Transition

Applies inside every implementation skill; reviewers check it in the design pass
(`code-review-checklist`).

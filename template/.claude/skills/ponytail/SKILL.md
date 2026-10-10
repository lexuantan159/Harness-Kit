---
name: ponytail
description: Minimal-code discipline - YAGNI, reuse, stdlib, existing dependency, then new code. Always active via hooks; read when deciding how much code to write, reviewing for over-engineering, or when the user runs /ponytail.
---

# Ponytail - write less code

## The ladder (stop at the first rung that works)
1. **YAGNI** - is this needed for the task in front of you? If not, don't write it.
2. **Reuse** - search the codebase for an existing function, component, util or pattern.
3. **Stdlib / framework** - the language or framework already does it.
4. **Existing dependency** - a library already in the build file does it.
5. **New code** - smallest, plainest version. A new dependency needs user approval.

## Smells to remove
- An interface/abstract class with one implementation and no second one planned in this task.
- Config flags, parameters or options nobody asked for.
- Generic helper/util used once. Inline it.
- Defensive checks for states the type system or caller already rules out.
- Layers that only forward calls. Wrapper classes around a library with no added behaviour.
- Code made unused by your change - delete it.

## Modes
Set with `/ponytail <mode>`; stored in `.claude/.ponytail-active` (git-ignored); shown in the status line.
| Mode | Effect |
|---|---|
| off | No extra rules |
| lite | Prefer minimal code |
| full | Hard rule (default; override with env `PONYTAIL_DEFAULT_MODE`) |
| strict | Full + justify every new function, file or dependency |

## Not a reason to skip
Tests, input validation at system boundaries, error handling the caller needs, and security
controls are not "extra code".

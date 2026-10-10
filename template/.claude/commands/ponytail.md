---
description: Show or change the ponytail minimal-code mode (off | lite | full | strict)
argument-hint: "[off|lite|full|strict]"
---

The ponytail hook has already handled this command and, if a valid mode was given, switched
mode and injected the new rules into context.

Reply with one line: the current ponytail mode and what it means:
- off: no extra rules
- lite: prefer minimal code (YAGNI -> reuse -> stdlib -> dependency -> new code)
- full: minimal code is a hard rule (default)
- strict: full + justify every new function, file or dependency

---
name: business-context
description: Understand and respect the business domain - actors, rules, glossary - before changing behaviour. Use when a task touches business rules, calculations, workflows/state machines, or user-visible behaviour.
---

# Business context

1. Read `docs/ai/context/BUSINESS.md`. If missing or placeholder, run `/index business` first or
   ask the user for the rules that matter.
2. Identify the business rules the task touches. For each, find where it is implemented
   (validators, services, DB constraints, front-end checks - often duplicated).
3. Classify the change: **preserves** existing rules, **changes** a rule, or **adds** a rule.
   Changing or adding a rule needs explicit confirmation from the user/ticket - never infer it.
4. Use the domain's words: name code after glossary terms; add new terms to BUSINESS.md.
5. Check impact on reports, exports, notifications, audit logs and downstream systems.

Red flags that require a question: money/rounding, dates/time zones, permissions,
deleting or anonymising data, legal/compliance wording, anything irreversible.

---
name: business-context
description: Use when a task touches business rules, calculations, workflows/state machines, or user-visible behaviour. Understands and respects the business domain - actors, rules, glossary - before changing behaviour.
---

# Business Context

Make sure a change preserves the business rules it should, and changes only the ones it was
asked to change.

<HARD-GATE>
Do NOT change or add a business rule without explicit confirmation from the user or the ticket.
Never infer a rule from code alone when money, dates, permissions, data deletion, legal wording or
anything irreversible is involved - ask. When only documenting rules (e.g. `@biz-analyst`),
record them marked "(inferred - confirm)" instead of asking.
</HARD-GATE>

## Anti-Pattern: "The Code Says So"

Code often implements a rule in several places, inconsistently. Treating one implementation as
the truth spreads a bug as a rule.

## Checklist

1. **Context** - read `docs/ai/context/BUSINESS.md`; if missing or a placeholder, run
   `/index business` first or ask the user for the rules that matter
2. **Identify** the rules the task touches and where each is implemented
3. **Classify** the change: preserves, changes or adds a rule
4. **Confirm** every changed or added rule
5. **Use the domain's words**
6. **Check downstream impact**

## The Process

- **Where rules live:** validators, services, DB constraints, front-end checks - often
  duplicated; list every place.
- **Domain words:** name code after glossary terms; add new terms to BUSINESS.md.
- **Downstream:** reports, exports, notifications, audit logs and downstream systems.
- **Red flags that always need a question:** money/rounding, dates/time zones, permissions,
  deleting or anonymising data, legal/compliance wording, anything irreversible.

## Key Principles

- Preserve by default; change only on confirmation
- One rule, every implementation
- The glossary names the code
- Red flags mean ask, not assume

## Transition

Confirmed rules become acceptance criteria (`requirements-analysis`) and then plan steps
(`writing-plans`).

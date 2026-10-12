---
name: brainstorming
description: Use before any new feature, component, or significant behavior change, or when the user says "I want to...", "how could we..." and there is no clear solution yet. Explores intent and requirements through dialogue, then produces an approved spec before any code is written.
---

# Brainstorming Ideas Into Designs

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine
the idea. Once you understand what you're building, present the design and get user approval.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any
implementation action until you have presented a design and the user has approved it. This
applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Every project goes through this process. A todo list, a single-function utility, a config
change - all of them. "Simple" projects are where unexamined assumptions cause the most wasted
work. The design can be short (a few sentences for truly simple projects), but you MUST present
it and get approval.

## Checklist

You MUST complete these steps in order:

1. **Explore project context** - read `docs/ai/context/ARCHITECTURE.md`, check files, recent commits
2. **Ask clarifying questions** - one at a time; purpose, constraints, success criteria
3. **Propose 2-3 approaches** - with trade-offs and your recommendation
4. **Present design** - in sections scaled to complexity; get user approval after each section
5. **Write design doc** - save to `docs/ai/specs/YYYY-MM-DD-<topic>-design.md`; commit only if
   the user asks
6. **Spec self-review** - check for placeholders, contradictions, ambiguity, scope gaps; fix inline
7. **User reviews spec** - ask the user to review the written spec before proceeding
8. **Transition** - invoke the `writing-plans` skill to create the implementation plan (`/plan`),
   or `spec-driven-development` (`/spec`) for features too big for a single plan

## The Process

**Understanding the idea:**

- Check `docs/ai/context/ARCHITECTURE.md` first (and `BUSINESS.md` when business rules are
  involved), then files, docs, recent commits
- Before asking detailed questions, assess scope. If the request spans multiple independent
  subsystems, flag it immediately and help decompose it into sub-projects - each with its own
  spec -> plan -> implementation cycle
- Ask questions one at a time. Only one question per message
- Prefer multiple-choice when possible; open-ended is fine too
- Focus on: who has the problem, how often, what it costs today, what "solved" looks like

**Exploring approaches:**

- Propose 2-3 genuinely different approaches with trade-offs (effort S/M/L, main risk, what it
  rules out later)
- Always consider "do nothing", "process change instead of code" and "use what we already have"
- Lead with your recommended option, explain why, and say what would change your mind

**Presenting the design:**

- Present in sections scaled to complexity (a few sentences for simple, up to 300 words for nuanced)
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing approach
- Be ready to revise if something doesn't fit

**Design principles:**

- Break the system into units with one clear purpose and well-defined interfaces
- Smaller, focused files - easier to reason about and edit reliably
- In existing codebases, follow established patterns; propose targeted improvements only where
  they serve the current goal
- YAGNI ruthlessly - remove unnecessary features from all designs; prefer the boring option when
  value is equal

**After the design:**

- Write the validated spec to `docs/ai/specs/YYYY-MM-DD-<topic>-design.md`. Commit it only if
  the user asks
- **Spec self-review:** scan for "TBD"/"TODO"/vague requirements; check internal consistency;
  verify scope is focused; fix all issues inline
- **User review gate:** ask the user to review the spec file before proceeding. Wait for
  approval. Apply any requested changes and re-run self-review
- **Then invoke the `writing-plans` skill** (or `spec-driven-development` for features too big for
  a single plan). Do NOT invoke any other implementation skill. If the
  user first wants a go/no-go decision, suggest `/assess` instead

## Key Principles

- **One question at a time** - don't overwhelm
- **Multiple choice preferred** - easier to answer than open-ended
- **YAGNI ruthlessly** - no speculative features
- **Explore alternatives** - always propose 2-3 approaches
- **Incremental validation** - present design sections, get approval, then move on

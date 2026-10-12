---
name: idea-assessment
description: Use for /assess, or when asked "should we build X", "is this worth it". Evaluates an idea or feature request for value, cost and risk and returns Go / Clarify / Kill.
---

# Idea Assessment

Decide whether an idea deserves a spec, with evidence instead of enthusiasm.

<HARD-GATE>
Do NOT plan, spec or write code during an assessment. The output is a verdict and the next step,
nothing more.
</HARD-GATE>

## Anti-Pattern: "Of Course We Should"

Ideas that skip assessment skip the cheaper alternatives too. Always compare against "do
nothing" and "use what we have".

## Checklist

1. **Context** - read `docs/ai/context/BUSINESS.md` and `ARCHITECTURE.md`
2. **Restate** the idea, the problem it solves, who benefits, how we would measure it
3. **Score** each dimension 1-5 with one line of evidence
4. **Alternatives** - cheaper options and the smallest experiment
5. **Verdict** - Go / Clarify / Kill
6. **Save** to `docs/ai/assessments/<slug>.md` with the table, alternatives and verdict

## The Process

**Dimensions**

| Dimension | Question |
|---|---|
| Value | Who benefits, how much, how do we measure it? |
| Urgency | What happens if we wait 3 months? |
| Fit | Does it fit the product and the architecture? |
| Effort | T-shirt size from a quick blast-radius look (`scout`, or `@researcher` in `/assess`) |
| Risk | Technical, security, data, operational, compliance |
| Reversibility | Can we roll it back or turn it off? |

**Always consider:** configuration, process change, an existing feature, buy vs build; the
smallest experiment that would prove the value. New technology -> `technology-evaluation`.

**Verdict**
- **Go**: value and fit >= 4, risk acceptable. Give the next step and first milestone.
- **Clarify**: list the exact questions that decide it and who can answer them.
- **Kill**: say why, and what evidence would reopen it.

## Key Principles

- Evidence for every score
- "Do nothing" is always an option
- Smallest experiment beats biggest plan
- A Kill says what would reopen it

## Transition

Go -> `brainstorming` for the design, then `/spec` or `/plan`. Clarify -> back to the person who
can answer. Kill -> stop.

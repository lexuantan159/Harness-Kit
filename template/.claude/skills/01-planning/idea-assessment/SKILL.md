---
name: idea-assessment
description: Evaluate an idea or feature request for value, cost and risk and return Go / Clarify / Kill. Use for /assess, or when asked "should we build X", "is this worth it".
---

# Idea assessment

## Score each 1-5 with one line of evidence
| Dimension | Question |
|---|---|
| Value | Who benefits, how much, how do we measure it? |
| Urgency | What happens if we wait 3 months? |
| Fit | Does it fit the product and the architecture? |
| Effort | T-shirt size from a quick blast-radius look (`scout`) |
| Risk | Technical, security, data, operational, compliance |
| Reversibility | Can we roll it back or turn it off? |

## Always consider
- Cheaper alternatives: configuration, process change, existing feature, buy vs build.
- Smallest experiment that would prove the value.

## Verdict
- **Go**: value and fit >= 4, risk acceptable. Give the next step and first milestone.
- **Clarify**: list the exact questions that decide it and who can answer them.
- **Kill**: say why, and what evidence would reopen it.

Output to `docs/ai/assessments/<slug>.md` with the table, alternatives and verdict.

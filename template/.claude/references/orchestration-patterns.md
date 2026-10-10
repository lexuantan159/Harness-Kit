# Orchestration patterns

| Pattern | Use when | Shape |
|---|---|---|
| Pipeline | Steps depend on each other | planner -> coder -> tester -> reviewer |
| Fan-out / fan-in | Independent sub-tasks (different files/areas) | N researchers in parallel -> merge findings |
| Generator / critic | Quality matters more than speed | coder produces -> reviewer critiques -> coder revises (max 3) |
| Independent gate | Risky change needs unbiased judgement | senior-reviewer sees artefact + criteria, not the author's summary |
| Scout first | Unfamiliar code | researcher maps area -> main agent plans with the map |

## Handoff template
```
Goal: ...
Acceptance criteria: ...
Inputs: files / plan step / constraints
Do not: touch X, add dependencies, push
Return: <format>
Budget: max 3 attempts
```

## Rules
- Subagents have no memory of the conversation: pass everything they need.
- Never let two agents edit the same file concurrently.
- Verify claims from subagents (re-run tests, read diffs) before reporting.
- Bounded loops: 3 rounds, then log to `docs/ai/report/harness-issues.md` and ask a human.

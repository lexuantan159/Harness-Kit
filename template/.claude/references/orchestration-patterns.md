# Orchestration Patterns

Reference catalog of agent orchestration patterns for this project. Read this before adding a
new slash command that coordinates multiple agents, or before introducing a new agent that wraps
existing ones.

The governing rule: **the user (or a slash command) is the orchestrator. Agents do not invoke
other agents.** Skills are mandatory steps inside an agent's workflow.

## Table of Contents

- [Endorsed Patterns](#endorsed-patterns)
- [Anti-Patterns](#anti-patterns)
- [Decision Flow](#decision-flow)
- [Agent File Contract](#agent-file-contract)
- [Handoff Formats](#handoff-formats)
- [Rules](#rules)

---

## Endorsed Patterns

### 1. Direct invocation (no orchestration)

Single agent, single perspective, single artifact. The default and cheapest option.

```
user → @reviewer → report → user
```

**Use when:** the work is one perspective on one artifact.

**Examples:**
- "Review this diff" → `@reviewer`
- "Find security issues in `auth.ts`" → `@reviewer` with the `security-audit` skill
- "What tests are missing?" → `@tester`

---

### 2. Single-agent slash command

A slash command that wraps one agent with the project's skills. Saves the user from
re-explaining the workflow every time.

```
/review → @reviewer (with code-review-checklist skill) → Issue List
```

**Use when:** the same single-agent invocation happens repeatedly with the same setup.

**Examples in this project:** `/review` (`@reviewer`), `/plan` (`@planner`), `/pr-review`
(`@pr-review`).

---

### 3. Parallel fan-out with merge

Multiple agents operate on the same input concurrently, each producing an independent report.
A merge step synthesizes them into a single result.

```
          ┌─→ @documenter   ─┐
/index ───┤                  ├→ check + merge → summary
          └─→ @biz-analyst  ─┘
```

**Use when:**
- Sub-tasks are genuinely independent
- Each agent benefits from its own context window
- The merge step is small enough to stay in the main context

**Examples in this project:** `/index` (`@documenter` and `@biz-analyst` in parallel).
`/pr-review` has the same fan-out-then-merge shape inside one agent: `agents/pr-review.md` runs
its panels (correctness, security, tests, design, operability) one after another, then merges
them into a merge score and an optional Teams notification.

---

### 4. Sequential pipeline driven by the user

The user runs slash commands in a defined order. There is no orchestrator agent - the user IS
the orchestrator.

```
user runs:  /plan  →  /code  →  /review
```

**Use when:** the workflow has dependencies and human judgment between steps adds value.

**Examples in this project:** the full `/plan` → `/code` → `/review` lifecycle. `/fix` follows
the same shape for bugs; `/spec` runs it inside one command but stops for approval after
Specify, Plan and Tasks.

---

### 5. Research isolation (context preservation)

When a task requires reading large amounts of material, spawn a research sub-agent that returns
only a digest.

```
main agent → @researcher (reads N files) → digest → main agent continues
```

**Use when:**
- The main session needs to stay focused
- The investigation result is much smaller than the input it consumes

---

### 6. Generator / critic loop (bounded)

One agent produces, another critiques, the producer revises. The command runs the loop; the
agents never call each other.

```
/code:  @coder → @tester ──Bug List──→ @coder   (max 3 per step)
        @coder → @reviewer ─Issue List→ @coder  (max 3 rounds)
```

**Use when:** quality matters more than speed and the critique has a machine-readable format.

---

### 7. Independent gate

A risky change gets an unbiased verdict from an agent that sees only the artefact and the
criteria, not the author's summary.

```
plan or diff + acceptance criteria → @senior-reviewer → Approve | Revise | Reject
```

**Use when:** auth, payments, personal data, permissions, data migration or public APIs are
touched. **Examples in this project:** `/plan` (risky scope), `/spec` (plan review), `/review`.

---

## Anti-Patterns

### A. Router agent ("meta-orchestrator")

An agent whose job is to decide which other agent to call.

**Why it fails:** a pure routing layer that adds token cost with no domain value. The user
already knows what they want. Use slash commands and the agent table in `AGENTS.md` instead.

### B. Agent that calls another agent

A `@reviewer` that internally invokes `@researcher` when it sees auth code.

**Why it fails:** chains lose context at each hand-off, cost doubles, failure modes multiply.

**Do instead:** have the agent *recommend* a follow-up in its report (for example `@coder` ends
with "Recommended next step: `@tester`"). The user or a slash command runs the second pass.

### C. Sequential orchestrator that paraphrases

An agent that calls `/plan`, then `/code`, etc. on the user's behalf.

**Why it fails:** loses human checkpoints, accumulates context drift, doubles token cost.
A command such as `/spec` that chains phases is fine only because it stops for approval
between them.

### D. Deep agent trees

`/review` → coordinator → quality-coordinator → @reviewer.

**Why it fails:** each layer adds latency and tokens with no decision value.

**Rule:** keep orchestration depth at most 1 (slash command → agents).

---

## Decision Flow

```
Is the work one perspective on one artifact?
├── Yes → Direct invocation. Stop.
└── No  → Will the same composition repeat?
         ├── No  → Direct invocation, ad hoc. Stop.
         └── Yes → Are sub-tasks independent?
                  ├── No  → Sequential slash commands run by the user
                  │         (or a bounded generator/critic loop inside one command).
                  └── Yes → Parallel fan-out with merge.
```

---

## Agent File Contract

Every file in `.claude/agents/` follows this shape (see `agents/coder.md`):

| Section | Content |
|---|---|
| Frontmatter | `name`, `description` (what it does + which commands use it), `tools`, `model` (tier string the installer maps) |
| Role line | One sentence: what this agent does and does not do |
| **Context** | Which `docs/ai/context/` files to read first and what to do without them: agents that cannot work without ARCHITECTURE.md stop and ask for `/index`; the others say so and continue; agents that write the docs refresh them |
| **Skills - Load When Needed** | Numbered list: skill name, kit folder, and the trigger for loading it. Refer to skills by name, never by path |
| **Input** | The formats it accepts and from whom (plan step, Issue List, Bug List, ticket, ...) |
| Rules / Principles | Ordering, limits and escalation rules for this role |
| Procedure | Numbered steps |
| **Done / Output** | Exit criteria, the output format, and the recommended next agent (recommended, not invoked) |

---

## Handoff Formats

| From | To | Format |
|---|---|---|
| `@reviewer` | `@coder` | `# Issue List` - ISSUE-NNN, Critical / Important / Suggestion |
| `@tester` | `@coder` | `# Bug List` - BUG-NNN, Critical / High / Medium / Low |
| `@senior-reviewer` | command | Verdict Approve / Revise / Reject + numbered required changes |
| command | any subagent | Handoff template below |

```
Goal: ...
Acceptance criteria: ...
Inputs: files / plan step / Issue List / Bug List / constraints
Do not: touch X, add dependencies, push
Return: <format>
Budget: max 3 attempts
```

## Rules

- Subagents have no memory of the conversation: pass everything they need.
- Never let two agents edit the same file concurrently.
- Verify claims from subagents (re-run tests, read diffs) before reporting.
- Bounded loops: 3 rounds, then log to `docs/ai/report/harness-issues.md` and ask a human.

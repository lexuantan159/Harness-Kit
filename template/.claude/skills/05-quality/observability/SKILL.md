---
name: observability
description: Use when adding a service/endpoint/job, investigating production issues, or reviewing logging. Adds logging, metrics, tracing and health checks that help operate the system without leaking data.
---

# Observability

Make the system answer "is it working, and if not, why?" without leaking data.

## Anti-Pattern: "Log Everything"

Verbose logs full of payloads cost money, hide the signal and leak personal data. Log decisions
and outcomes, not dumps.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` (cross-cutting concerns: logging, tracing)
   and copy the existing logger, metrics and tracing setup
2. **Logging** at boundaries and decisions
3. **Metrics** for requests, resources and key business events
4. **Tracing** across process boundaries
5. **Health** checks
6. **Alerts** on user-facing symptoms

## The Process

**Logging**
- Use the project logger and format (structured JSON in services). Levels: ERROR = needs action,
  WARN = degraded but handled, INFO = business events/boundaries, DEBUG = diagnostics (off in prod).
- Include correlation/trace id, operation, entity ids, duration, outcome.
- Never log secrets, tokens, passwords, full card numbers or personal data; mask if unavoidable.
- Log an exception once, where it is handled, with the stack trace.

**Metrics (RED/USE)**
- Requests: rate, errors, duration (histogram) per endpoint/job.
- Resources: pool usage, queue depth, cache hit ratio.
- Business counters for key events (orders placed, payments failed).
- Low-cardinality labels only (no user ids in labels).

**Tracing** - propagate W3C trace context across HTTP/messaging; a span per external call
(OpenTelemetry if present).

**Health** - liveness (process up) vs readiness (dependencies ready); no heavy checks in liveness.

**Alerts** - on symptoms users feel (error rate, latency SLO), with a runbook link.

## Key Principles

- Structured, correlated, low-cardinality
- Never log secrets or personal data
- Log an exception once
- Alert on symptoms, not causes

## Transition

Runbooks for new alerts go through `technical-writing`; rollout of new health checks through
`deployment-strategy`.

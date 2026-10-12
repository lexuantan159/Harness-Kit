---
name: observability
description: Add logging, metrics, tracing and health checks that help operate the system without leaking data. Use when adding a service/endpoint/job, investigating production issues, or reviewing logging.
---

# Observability

## Logging
- Use the project logger and format (structured JSON in services). Levels: ERROR = needs action,
  WARN = degraded but handled, INFO = business events/boundaries, DEBUG = diagnostics (off in prod).
- Include correlation/trace id, operation, entity ids, duration, outcome.
- Never log secrets, tokens, passwords, full card numbers or personal data; mask if unavoidable.
- Log an exception once, where it is handled, with the stack trace.

## Metrics (RED/USE)
- Requests: rate, errors, duration (histogram) per endpoint/job.
- Resources: pool usage, queue depth, cache hit ratio.
- Business counters for key events (orders placed, payments failed).
- Low-cardinality labels only (no user ids in labels).

## Tracing
- Propagate W3C trace context across HTTP/messaging; span per external call (OpenTelemetry if present).

## Health
- Liveness (process up) vs readiness (dependencies ready); no heavy checks in liveness.

## Alerts
- Alert on symptoms users feel (error rate, latency SLO), with a runbook link.

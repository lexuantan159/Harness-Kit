---
name: real-time-features
description: Use for live updates, notifications, chat, dashboards or collaboration. Builds real-time features - WebSockets, Server-Sent Events, polling, pub/sub - with auth, reconnection, ordering and scaling handled.
---

# Real-Time Features

Deliver live updates reliably and securely with the simplest transport that works.

## Anti-Pattern: "WebSockets By Default"

WebSockets add connection state, scaling and operational cost. Most notification feeds work with
SSE or polling.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` (instances, broker, auth)
2. **Pick the simplest transport**
3. **Auth** at connect and per subscription
4. **Message format** and limits
5. **Reliability** - reconnect, resume, idempotency
6. **Scaling** across instances
7. **Backpressure**
8. **Test**

## The Process

- **Transport:**
  - polling / long-polling: low frequency, simplest, works everywhere
  - SSE: server -> client streams over HTTP, auto-reconnect; good default for notifications/feeds
  - WebSocket: bidirectional, low latency (chat, collaboration); more operational cost
- **Auth:** authenticate the connection (token at handshake / cookie); re-check authorization per
  channel/topic subscription; close connections when the session ends.
- **Messages:** versioned JSON envelope `{type, id, ts, payload}`; validate inbound messages; size
  limits; rate limits per connection.
- **Reliability:** client reconnect with backoff; resume from last event id; idempotent handlers;
  don't assume ordering across reconnects; heartbeat/ping to detect dead peers.
- **Scaling:** a broker (Redis pub/sub, Kafka, NATS) or sticky sessions; keep connection state
  out of business logic.
- **Backpressure:** bounded queues per client; drop or coalesce for slow consumers.
- **Tests:** connect/subscribe/receive, unauthorized subscribe rejected, reconnect resumes.

## Key Principles

- Simplest transport that meets the latency need
- Authorize every subscription
- Assume disconnects; resume idempotently
- Bounded queues per client

## Transition

Auth changes go through `authentication`; rollout of a new broker or connection type through
`deployment-strategy`; then `@reviewer`.

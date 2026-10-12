---
name: real-time-features
description: Build real-time features - WebSockets, Server-Sent Events, polling, pub/sub - with auth, reconnection, ordering and scaling handled. Use for live updates, notifications, chat, dashboards or collaborative editing.
---

# Real-time features

1. **Pick the simplest transport**
   - Polling / long-polling: low frequency, simplest, works everywhere.
   - SSE: server -> client streams over HTTP, auto-reconnect, good default for notifications/feeds.
   - WebSocket: bidirectional, low latency (chat, collaboration). More operational cost.
2. **Auth** - authenticate the connection (token at handshake / cookie), re-check authorization
   per channel/topic subscription. Close connections when the session ends.
3. **Messages** - versioned JSON envelope `{type, id, ts, payload}`; validate inbound messages;
   size limits; rate limits per connection.
4. **Reliability** - client reconnect with backoff; resume from last event id; idempotent handlers;
   don't assume ordering across reconnects; heartbeat/ping to detect dead peers.
5. **Scaling** - multiple instances need a broker (Redis pub/sub, Kafka, NATS) or sticky sessions;
   keep connection state out of business logic.
6. **Backpressure** - bounded queues per client; drop or coalesce for slow consumers.
7. **Test** - connect/subscribe/receive, unauthorized subscribe rejected, reconnect resumes.

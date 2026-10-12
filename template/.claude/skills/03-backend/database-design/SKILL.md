---
name: database-design
description: Use for any schema change, new entity, or slow query that needs an index. Designs or changes database schema - tables, keys, constraints, indexes, migrations - safely and reversibly.
---

# Database Design

Change the schema so data stays correct and the live system keeps running.

<HARD-GATE>
Do NOT run or write destructive changes (DROP, data delete, type narrowing) without explicit user
approval. Never edit a migration that has already been applied - add a new one.
</HARD-GATE>

## Anti-Pattern: "Integrity In The Code"

Rules enforced only in application code break the first time another service, script or bug
writes to the table. Put integrity in the database.

## Checklist

1. **Context** - read `docs/ai/context/SCHEMA.md`; copy naming conventions (case, plural/singular, PK type)
2. **Model** - keys, constraints, types
3. **Index** for real query patterns
4. **Migration** with the project's tool and a rollback plan
5. **Zero-downtime** pattern for live tables
6. **Verify** and update SCHEMA.md

## The Process

**Modelling**
- Every table: primary key, `created_at`/`updated_at` if the project uses them, NOT NULL by default.
- Integrity in the database: foreign keys, unique constraints, check constraints.
- Money: decimal/numeric (never float). Time: timestamp with time zone / UTC.
- Index for WHERE, JOIN, ORDER BY patterns; composite index column order matters.

**Migrations**
- Use the project's tool (Flyway, Liquibase, Alembic, Prisma, EF, Knex...).
- Live tables: expand (add nullable column/new table) -> deploy code writing both -> backfill in
  batches -> switch reads -> contract (drop old) in a later release.
- Large tables: create indexes concurrently/online; avoid long locks; batch updates.
- Every migration has a rollback plan (down script or documented forward-fix).

**Verify** - run migrations on a fresh DB and on a copy with data; run repository/integration
tests; `EXPLAIN` new queries.

## Key Principles

- Integrity in the database
- Expand, migrate, contract
- Never edit an applied migration
- Destructive changes need approval

## Transition

Update `docs/ai/context/SCHEMA.md`; data migrations go through `senior-review` and
`deployment-strategy` (rollout and rollback).

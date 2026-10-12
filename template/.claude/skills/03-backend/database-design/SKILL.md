---
name: database-design
description: Design or change database schema - tables, keys, constraints, indexes, migrations - safely and reversibly. Use for any schema change, new entity, or slow query that needs an index.
---

# Database design

## Modelling
- Read `docs/ai/context/SCHEMA.md` and copy naming conventions (case, plural/singular, PK type).
- Every table: primary key, `created_at`/`updated_at` if the project uses them, NOT NULL by default.
- Integrity in the database: foreign keys, unique constraints, check constraints - not only in code.
- Money: decimal/numeric (never float). Time: timestamp with time zone / UTC.
- Index for real query patterns (WHERE, JOIN, ORDER BY); composite index column order matters.

## Migrations
- Use the project's tool (Flyway, Liquibase, Alembic, Prisma, EF, Knex...). Never edit an applied
  migration; add a new one.
- Zero-downtime pattern for live tables: expand (add nullable column/new table) -> deploy code
  writing both -> backfill in batches -> switch reads -> contract (drop old) in a later release.
- Large tables: create indexes concurrently/online; avoid long locks; batch updates.
- Every migration has a rollback plan (down script or documented forward-fix).
- **Destructive changes (DROP, data delete, type narrowing) need explicit user approval.**

## Verify
Run migrations on a fresh DB and on a copy with data; run repository/integration tests;
`EXPLAIN` new queries. Update SCHEMA.md.

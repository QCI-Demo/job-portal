# Job Portal

This repository currently hosts the **normalized PostgreSQL schema** for the Job Portal core entities: users, roles (RBAC), jobs, and applications.

## What is included

- **Migrations**: `db/migrations/000001_initial_job_portal_schema.{up,down}.sql` create and drop the core tables with foreign keys, check constraints, and performance-oriented indexes.
- **ERD**: `docs/job-portal-erd.md` contains a Mermaid entity-relationship diagram (renders on GitHub; export to PNG or PDF from your Markdown viewer if needed).
- **Sample SQL**: `db/sample_queries.sql` exercises registration-style inserts, role assignment, job posting, application submission, and common reporting joins.
- **Constraint check**: `db/constraint_tests.sql` asserts the one-application-per-candidate-per-job rule.
- **CI**: `.github/workflows/validate-db-schema.yml` applies the migration and runs the SQL scripts against PostgreSQL 16.

## Design highlights

- **Third normal form**: repeating role names live only in `roles`; user–role assignments are modeled in `user_roles` instead of widening `users`. Job attributes are not duplicated on applications.
- **Referential integrity**: explicit `ON DELETE` policies (for example, cascade applications when a job is removed; restrict deleting users who still own job rows).
- **Case-insensitive email uniqueness** without the `citext` extension: `ux_users_email_lower` on `lower(email)`.
- **Extensibility**: optional `metadata` JSONB on `users`, `jobs`, and `applications` for forward-compatible attributes without immediate new tables.

## Local validation (optional)

When Docker and `psql` are available:

```bash
./scripts/validate_schema.sh
```

The script starts `docker compose` (PostgreSQL on port **5433**), reapplies `down` then `up`, and runs `db/sample_queries.sql`.

## ORM compatibility

UUID primary keys, explicit timestamps, and JSONB map cleanly to Sequelize, TypeORM, Prisma, and typical Go SQL layers used alongside **Gin** for HTTP routing.

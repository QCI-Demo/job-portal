# Job Portal Core Schema (ERD)

This diagram is Mermaid-based so it renders on GitHub/GitLab and can be exported from many Markdown tools to PNG or PDF.

```mermaid
erDiagram
    ROLES ||--o{ USER_ROLES : assigns
    USERS ||--o{ USER_ROLES : has
    USERS ||--o{ JOBS : posts
    USERS ||--o{ USER_ROLES : "grants (optional audit)"
    JOBS ||--o{ APPLICATIONS : receives
    USERS ||--o{ APPLICATIONS : submits

    ROLES {
        smallserial id PK
        varchar name UK "lowercase slug"
        varchar description
        timestamptz created_at
        timestamptz updated_at
    }

    USERS {
        uuid id PK
        varchar email UK "unique on lower(email)"
        varchar password_hash
        varchar display_name
        timestamptz email_verified_at
        varchar status
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }

    USER_ROLES {
        uuid user_id PK_FK
        smallint role_id PK_FK
        timestamptz granted_at
        uuid granted_by FK "nullable audit"
    }

    JOBS {
        uuid id PK
        uuid employer_user_id FK
        varchar title
        text description
        varchar location
        varchar employment_type
        int salary_min_cents
        int salary_max_cents
        char currency_code
        varchar status
        timestamptz published_at
        timestamptz closes_at
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
    }

    APPLICATIONS {
        uuid id PK
        uuid job_id FK
        uuid candidate_user_id FK
        varchar status
        text cover_letter
        varchar resume_url
        jsonb metadata
        timestamptz applied_at
        timestamptz updated_at
    }
```

## Cardinality and integrity (summary)

- **Users to roles**: many-to-many via `user_roles`; composite primary key prevents duplicate grants.
- **Users to jobs**: one employer user to many jobs; `jobs.employer_user_id` references `users` with `ON DELETE RESTRICT` so postings are not silently orphaned.
- **Jobs to applications**: one job to many applications; `applications.job_id` uses `ON DELETE CASCADE` so applications disappear with the job (adjust if your product needs retention/history tables later).
- **Users to applications**: one candidate user to many applications; `applications.candidate_user_id` uses `ON DELETE CASCADE`.
- **Uniqueness**: one application per candidate per job via `ux_applications_job_candidate` on `(job_id, candidate_user_id)`.

## ORM mapping notes

- UUID primary keys and explicit `created_at` / `updated_at` align with Sequelize, TypeORM, and Prisma defaults.
- `metadata` JSONB columns provide forward-compatible extension without schema churn.
- Check constraints encode enumerated lifecycles at the database layer; ORMs can mirror these as enums in application code.

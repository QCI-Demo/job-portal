-- Job Portal core schema (PostgreSQL)
-- Normalized to 3NF: atomic columns, no transitive dependencies, junction table for user↔role M:N.
-- Requires PostgreSQL 13+ (gen_random_uuid in core).

-- ---------------------------------------------------------------------------
-- roles: system roles for RBAC (extensible via new rows, not new columns)
-- ---------------------------------------------------------------------------
CREATE TABLE roles (
    id          SMALLSERIAL PRIMARY KEY,
    name        VARCHAR(64) NOT NULL,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT roles_name_lower_chk CHECK (name = lower(name)),
    CONSTRAINT roles_name_len_chk CHECK (char_length(name) >= 2)
);

CREATE UNIQUE INDEX ux_roles_name ON roles (name);

COMMENT ON TABLE roles IS 'Application roles (e.g. candidate, employer, admin). RBAC assignments live in user_roles.';

-- ---------------------------------------------------------------------------
-- users: authentication identity (profile fields kept minimal; extend via JSONB or future tables)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             VARCHAR(320) NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    display_name      VARCHAR(120) NOT NULL,
    email_verified_at TIMESTAMPTZ,
    status            VARCHAR(32) NOT NULL DEFAULT 'active'
        CONSTRAINT users_status_chk CHECK (status IN ('active', 'suspended', 'deleted')),
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_email_len_chk CHECK (char_length(email) >= 3),
    CONSTRAINT users_display_name_len_chk CHECK (char_length(display_name) >= 1)
);

CREATE UNIQUE INDEX ux_users_email_lower ON users (lower(email));
CREATE INDEX ix_users_status_created_at ON users (status, created_at DESC);

COMMENT ON TABLE users IS 'Login identity for all personas; role-specific behavior is driven by user_roles.';

-- ---------------------------------------------------------------------------
-- user_roles: M:N between users and roles
-- ---------------------------------------------------------------------------
CREATE TABLE user_roles (
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id    SMALLINT NOT NULL REFERENCES roles (id) ON DELETE RESTRICT,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by UUID REFERENCES users (id) ON DELETE SET NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX ix_user_roles_role_id ON user_roles (role_id);
CREATE INDEX ix_user_roles_user_id ON user_roles (user_id);

COMMENT ON TABLE user_roles IS 'Role assignments; composite PK prevents duplicate role grants.';

-- ---------------------------------------------------------------------------
-- jobs: listings owned by an employer user
-- ---------------------------------------------------------------------------
CREATE TABLE jobs (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_user_id  UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    title             VARCHAR(200) NOT NULL,
    description       TEXT NOT NULL,
    location          VARCHAR(200),
    employment_type   VARCHAR(64),
    salary_min_cents  INTEGER,
    salary_max_cents  INTEGER,
    currency_code     CHAR(3) NOT NULL DEFAULT 'USD',
    status            VARCHAR(32) NOT NULL DEFAULT 'draft'
        CONSTRAINT jobs_status_chk CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    published_at      TIMESTAMPTZ,
    closes_at         TIMESTAMPTZ,
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT jobs_title_len_chk CHECK (char_length(title) >= 3),
    CONSTRAINT jobs_salary_range_chk CHECK (
        salary_min_cents IS NULL
        OR salary_max_cents IS NULL
        OR salary_min_cents <= salary_max_cents
    )
);

CREATE INDEX ix_jobs_employer_user_id ON jobs (employer_user_id);
CREATE INDEX ix_jobs_status_published_at ON jobs (status, published_at DESC NULLS LAST);
CREATE INDEX ix_jobs_title_lower ON jobs (lower(title));

COMMENT ON TABLE jobs IS 'Job postings; employer_user_id is the posting account (must hold employer role at app layer).';

-- ---------------------------------------------------------------------------
-- applications: candidate applies to a job (one row per candidate per job)
-- ---------------------------------------------------------------------------
CREATE TABLE applications (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id            UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    candidate_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status            VARCHAR(32) NOT NULL DEFAULT 'submitted'
        CONSTRAINT applications_status_chk CHECK (
            status IN ('submitted', 'in_review', 'shortlisted', 'rejected', 'withdrawn', 'hired')
        ),
    cover_letter      TEXT,
    resume_url        VARCHAR(2048),
    metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
    applied_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ux_applications_job_candidate ON applications (job_id, candidate_user_id);
CREATE INDEX ix_applications_candidate_user_id ON applications (candidate_user_id, applied_at DESC);
CREATE INDEX ix_applications_job_id ON applications (job_id, applied_at DESC);
CREATE INDEX ix_applications_status ON applications (status);

COMMENT ON TABLE applications IS 'Candidate applications; unique(job_id, candidate_user_id) enforces one application per job.';

-- ---------------------------------------------------------------------------
-- Seed canonical roles (idempotent for tooling that may re-apply statements)
-- ---------------------------------------------------------------------------
INSERT INTO roles (name, description)
SELECT v.name, v.description
FROM (VALUES
    ('candidate', 'Job seeker: search and apply.'),
    ('employer', 'Hiring party: post jobs and review applications.'),
    ('admin', 'Platform operator: elevated access.')
) AS v(name, description)
WHERE NOT EXISTS (SELECT 1 FROM roles r WHERE r.name = v.name);

-- Sample operations to validate the core schema (run after 000001_initial_job_portal_schema.up.sql).
-- Deletes then inserts fixed test rows so the script can be re-run on the same database.

BEGIN;

DELETE FROM applications WHERE id = 'c3333333-3333-4333-8333-333333333301'::uuid;
DELETE FROM jobs WHERE id = 'f2222222-2222-4222-8222-222222222201'::uuid;
DELETE FROM user_roles WHERE user_id IN (
    'a1111111-1111-4111-8111-111111111101'::uuid,
    'a1111111-1111-4111-8111-111111111102'::uuid
);
DELETE FROM users WHERE id IN (
    'a1111111-1111-4111-8111-111111111101'::uuid,
    'a1111111-1111-4111-8111-111111111102'::uuid
);

INSERT INTO users (id, email, password_hash, display_name)
VALUES
    ('a1111111-1111-4111-8111-111111111101'::uuid, 'employer@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Pat Employer'),
    ('a1111111-1111-4111-8111-111111111102'::uuid, 'candidate@example.com', '$2a$10$yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', 'Chris Candidate');

INSERT INTO user_roles (user_id, role_id)
SELECT 'a1111111-1111-4111-8111-111111111101'::uuid, r.id FROM roles r WHERE r.name = 'employer';

INSERT INTO user_roles (user_id, role_id)
SELECT 'a1111111-1111-4111-8111-111111111102'::uuid, r.id FROM roles r WHERE r.name = 'candidate';

INSERT INTO jobs (id, employer_user_id, title, description, location, employment_type, status, published_at)
VALUES (
    'f2222222-2222-4222-8222-222222222201'::uuid,
    'a1111111-1111-4111-8111-111111111101'::uuid,
    'Senior Backend Engineer',
    'Design APIs and relational schemas for a job portal.',
    'Remote',
    'full_time',
    'published',
    now()
);

INSERT INTO applications (id, job_id, candidate_user_id, status, cover_letter)
VALUES (
    'c3333333-3333-4333-8333-333333333301'::uuid,
    'f2222222-2222-4222-8222-222222222201'::uuid,
    'a1111111-1111-4111-8111-111111111102'::uuid,
    'submitted',
    'I enjoy PostgreSQL and Gin.'
);

COMMIT;

-- List applications for a candidate (indexed path: candidate_user_id, applied_at)
SELECT a.id, a.status, j.title, a.applied_at
FROM applications a
JOIN jobs j ON j.id = a.job_id
WHERE a.candidate_user_id = 'a1111111-1111-4111-8111-111111111102'::uuid
ORDER BY a.applied_at DESC;

-- Jobs posted by an employer
SELECT j.id, j.title, j.status, j.published_at
FROM jobs j
WHERE j.employer_user_id = 'a1111111-1111-4111-8111-111111111101'::uuid
ORDER BY j.published_at DESC NULLS LAST;

-- Applications for a job with candidate display names
SELECT a.id, u.display_name, u.email, a.status
FROM applications a
JOIN users u ON u.id = a.candidate_user_id
WHERE a.job_id = 'f2222222-2222-4222-8222-222222222201'::uuid;

-- RBAC: roles for a user
SELECT r.name
FROM user_roles ur
JOIN roles r ON r.id = ur.role_id
WHERE ur.user_id = 'a1111111-1111-4111-8111-111111111102'::uuid
ORDER BY r.name;

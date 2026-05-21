-- Expects sample_queries.sql to have run (or equivalent seed rows present).

DO $$
DECLARE
    v_job_id uuid := 'f2222222-2222-4222-8222-222222222201'::uuid;
    v_candidate_id uuid := 'a1111111-1111-4111-8111-111111111102'::uuid;
BEGIN
    BEGIN
        INSERT INTO applications (job_id, candidate_user_id, status)
        VALUES (v_job_id, v_candidate_id, 'submitted');
        RAISE EXCEPTION 'expected unique violation on (job_id, candidate_user_id), but insert succeeded';
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE 'OK: duplicate application rejected as expected';
    END;
END;
$$;

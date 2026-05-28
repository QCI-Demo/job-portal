-- Seed system roles (idempotent for re-runs in custom init flows).
INSERT INTO roles (name, description) VALUES
  ('candidate', 'Job seeker: search and apply.'),
  ('employer', 'Hiring party: post jobs and review applications.'),
  ('admin', 'Platform operator: elevated access.')
ON CONFLICT (name) DO NOTHING;

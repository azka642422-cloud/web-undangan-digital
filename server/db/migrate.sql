\set ON_ERROR_STOP on

-- AKSARA UNDANGAN database bootstrap / migration entrypoint.
-- Run with psql so \ir resolves these files relative to this script:
--   psql "$DATABASE_URL" -f db/migrate.sql
--
-- Ordering is intentional: schema.sql creates orders first; auth.sql then
-- creates users/sessions and attaches orders.user_id.

\ir schema.sql
\ir auth.sql

--create user with privileges

Do $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'grader_user') THEN
        CREATE ROLE grader_user WITH LOGIN PASSWORD '1234';
    END IF;
END
$$;

-- Allow connection to the current database
GRANT USAGE ON SCHEMA public TO grader_user;
REVOKE CREATE ON SCHEMA public FROM grader_user;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM grader_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE task TO grader_user;
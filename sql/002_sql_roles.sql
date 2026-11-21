--create user 

Do $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'grader_user') THEN
        CREATE ROLE grader_user WITH LOGIN PASSWORD '1234';
    END IF;
END
$$;


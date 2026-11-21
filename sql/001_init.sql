CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    owner_login VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
    done BOOLEAN NOT NULL DEFAULT FALSE,
    run_id VARCHAR(64) NOT NULL CHECK (run_id ~ '^[A-Za-z0-9_-]{1,64}$'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);
CREATE INDEX IF NOT EXISTS idx_tasks_owner_run ON tasks (owner_login, run_id);
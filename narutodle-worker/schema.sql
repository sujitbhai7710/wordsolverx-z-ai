DROP TABLE IF EXISTS answers;
CREATE TABLE IF NOT EXISTS answers (
    game TEXT,
    date TEXT,
    mode TEXT,
    region TEXT DEFAULT 'america',
    game_id INTEGER,
    json_content TEXT,
    created_at INTEGER,
    PRIMARY KEY (game, date, mode, region)
);

-- Index for faster searching by title
CREATE INDEX IF NOT EXISTS idx_json_content ON answers(json_content);

-- Migration number: 0000 	 2026-01-01T00:00:00.000Z
-- This is the initial migration that creates the base answers table
-- Note: This migration should only be applied to fresh/local databases
-- Production database already has this table

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  solution TEXT NOT NULL,
  days_since_launch INTEGER,
  editor TEXT
);

-- Create index on date for faster lookups
CREATE INDEX IF NOT EXISTS idx_answers_date ON answers(date);

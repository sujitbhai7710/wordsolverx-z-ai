-- Migration number: 0001 	 2026-02-07T00:00:00.000Z
ALTER TABLE answers ADD COLUMN content_guide TEXT;
ALTER TABLE answers ADD COLUMN social_image TEXT;

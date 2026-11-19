CREATE TABLE IF NOT EXISTS offer_media (
  id TEXT PRIMARY KEY,
  mime TEXT NOT NULL CHECK (mime IN ('image/jpeg','image/webp','image/png')),
  content BLOB NOT NULL CHECK (length(content) BETWEEN 8 AND 524288),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS offers_media ON offers(image,active);

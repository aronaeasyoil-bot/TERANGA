PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  partner_id TEXT NOT NULL REFERENCES partners(id),
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER,
  bedrooms INTEGER,
  price_fils INTEGER,
  unit TEXT NOT NULL,
  terms_fr TEXT NOT NULL,
  terms_en TEXT NOT NULL,
  image TEXT,
  active INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS offers_catalog ON offers(service,active,created_at);

CREATE TABLE IF NOT EXISTS requests (
  ref TEXT PRIMARY KEY,
  access_hash TEXT NOT NULL UNIQUE,
  fingerprint TEXT NOT NULL,
  service TEXT NOT NULL,
  offer_id TEXT REFERENCES offers(id),
  language TEXT NOT NULL CHECK (language IN ('fr','en')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  fields TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','review','quoted','accepted','partner_pending','confirmed','completed','cancelled')),
  amount_fils INTEGER CHECK (amount_fils > 0),
  quote_text TEXT,
  expires_at TEXT,
  confirmation_ref TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS requests_inbox ON requests(created_at DESC, ref);
CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY,
  subject TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS audit_subject ON audit_events(subject,id);
CREATE TRIGGER IF NOT EXISTS request_created AFTER INSERT ON requests
BEGIN
  INSERT INTO audit_events(subject,action,details) VALUES (NEW.ref,'request','new');
END;
CREATE TRIGGER IF NOT EXISTS request_state AFTER UPDATE OF status ON requests
WHEN OLD.status <> NEW.status
BEGIN
  INSERT INTO audit_events(subject,action,details) VALUES (NEW.ref,'status',NEW.status);
END;
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT PRIMARY KEY,
  window INTEGER NOT NULL,
  hits INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_expiry ON rate_limits(window);

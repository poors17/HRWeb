CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR NOT NULL,
  module VARCHAR NOT NULL,
  record_id INTEGER,
  description TEXT,
  ip_address VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
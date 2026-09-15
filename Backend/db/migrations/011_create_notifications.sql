CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR,
  reference_id INTEGER,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  posted_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name)
VALUES
  ('Super Admin'),
  ('HR'),
  ('Manager'),
  ('Finance/Payroll'),
  ('Management')
ON CONFLICT (name) DO NOTHING;

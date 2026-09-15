CREATE TABLE IF NOT EXISTS holidays (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  date DATE NOT NULL,
  punch_in TIMESTAMP,
  punch_out TIMESTAMP,
  status VARCHAR,
  working_hours NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS leave_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  default_days_per_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_balances (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  leave_type_id INTEGER REFERENCES leave_types(id),
  year INTEGER NOT NULL,
  total_days NUMERIC NOT NULL,
  used_days NUMERIC DEFAULT 0,
  UNIQUE(employee_id, leave_type_id, year)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  leave_type_id INTEGER REFERENCES leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days NUMERIC NOT NULL,
  reason TEXT,
  status VARCHAR DEFAULT 'Pending',
  approved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO leave_types (name, default_days_per_year)
VALUES
  ('Casual Leave', 12),
  ('Sick Leave', 10),
  ('Earned Leave', 15)
ON CONFLICT (name) DO NOTHING;
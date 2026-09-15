CREATE TABLE IF NOT EXISTS wfh_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR DEFAULT 'Pending',
  approved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permission_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  date DATE NOT NULL,
  from_time TIME NOT NULL,
  to_time TIME NOT NULL,
  reason TEXT,
  status VARCHAR DEFAULT 'Pending',
  approved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_code VARCHAR UNIQUE NOT NULL,
  asset_type VARCHAR NOT NULL,
  serial_number VARCHAR,
  purchase_date DATE,
  purchase_value NUMERIC,
  status VARCHAR DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asset_assignments (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES assets(id),
  employee_id INTEGER REFERENCES employees(id),
  assigned_date DATE NOT NULL,
  returned_date DATE,
  acknowledged BOOLEAN DEFAULT false,
  condition_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exit_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  resignation_date DATE NOT NULL,
  last_working_date DATE,
  notice_period_days INTEGER,
  reason TEXT,
  status VARCHAR DEFAULT 'Submitted',
  exit_interview_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exit_clearances (
  id SERIAL PRIMARY KEY,
  exit_request_id INTEGER REFERENCES exit_requests(id),
  clearance_type VARCHAR NOT NULL,
  cleared_by INTEGER REFERENCES users(id),
  is_cleared BOOLEAN DEFAULT false,
  remarks TEXT,
  cleared_at TIMESTAMP
);
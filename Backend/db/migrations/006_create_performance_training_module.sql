CREATE TABLE IF NOT EXISTS performance_cycles (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_goals (
  id SERIAL PRIMARY KEY,
  cycle_id INTEGER REFERENCES performance_cycles(id),
  employee_id INTEGER REFERENCES employees(id),
  title VARCHAR NOT NULL,
  description TEXT,
  target TEXT,
  weightage NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_reviews (
  id SERIAL PRIMARY KEY,
  cycle_id INTEGER REFERENCES performance_cycles(id),
  employee_id INTEGER REFERENCES employees(id),
  self_review TEXT,
  manager_review TEXT,
  rating NUMERIC,
  final_outcome VARCHAR,
  reviewed_by INTEGER REFERENCES users(id),
  status VARCHAR DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  trainer_name VARCHAR,
  start_date DATE,
  end_date DATE,
  materials_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_enrollments (
  id SERIAL PRIMARY KEY,
  training_program_id INTEGER REFERENCES training_programs(id),
  employee_id INTEGER REFERENCES employees(id),
  status VARCHAR DEFAULT 'Enrolled',
  completion_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  name VARCHAR NOT NULL,
  issued_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS job_postings (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  description TEXT,
  status VARCHAR DEFAULT 'Open',
  posted_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  job_posting_id INTEGER REFERENCES job_postings(id),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  resume_url TEXT,
  status VARCHAR DEFAULT 'Applied',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id),
  interviewer_id INTEGER REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  feedback TEXT,
  result VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  task_name VARCHAR NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
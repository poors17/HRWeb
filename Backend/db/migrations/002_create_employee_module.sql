CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS designations (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  location VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shifts (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  employee_code VARCHAR UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR NOT NULL,
  date_of_birth DATE,
  gender VARCHAR,
  mobile_number VARCHAR,
  personal_email VARCHAR,
  current_address TEXT,
  permanent_address TEXT,
  emergency_contact_name VARCHAR,
  emergency_contact_number VARCHAR,
  date_of_joining DATE,
  employment_type VARCHAR,
  department_id INTEGER REFERENCES departments(id),
  designation_id INTEGER REFERENCES designations(id),
  reporting_manager_id INTEGER REFERENCES employees(id),
  branch_id INTEGER REFERENCES branches(id),
  shift_id INTEGER REFERENCES shifts(id),
  employment_status VARCHAR DEFAULT 'Active',
  bank_account_number VARCHAR,
  bank_ifsc VARCHAR,
  bank_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
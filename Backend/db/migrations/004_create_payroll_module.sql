CREATE TABLE IF NOT EXISTS salary_structures (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) UNIQUE,
  basic_salary NUMERIC NOT NULL,
  hra NUMERIC DEFAULT 0,
  other_allowances NUMERIC DEFAULT 0,
  pf_deduction NUMERIC DEFAULT 0,
  esi_deduction NUMERIC DEFAULT 0,
  professional_tax NUMERIC DEFAULT 0,
  tds NUMERIC DEFAULT 0,
  effective_from DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll_runs (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status VARCHAR DEFAULT 'Draft',
  processed_by INTEGER REFERENCES users(id),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(month, year)
);

CREATE TABLE IF NOT EXISTS payslips (
  id SERIAL PRIMARY KEY,
  payroll_run_id INTEGER REFERENCES payroll_runs(id),
  employee_id INTEGER REFERENCES employees(id),
  basic_salary NUMERIC NOT NULL,
  hra NUMERIC DEFAULT 0,
  other_allowances NUMERIC DEFAULT 0,
  gross_salary NUMERIC NOT NULL,
  pf_deduction NUMERIC DEFAULT 0,
  esi_deduction NUMERIC DEFAULT 0,
  professional_tax NUMERIC DEFAULT 0,
  tds NUMERIC DEFAULT 0,
  loss_of_pay_days NUMERIC DEFAULT 0,
  loss_of_pay_amount NUMERIC DEFAULT 0,
  total_deductions NUMERIC NOT NULL,
  net_salary NUMERIC NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(payroll_run_id, employee_id)
);
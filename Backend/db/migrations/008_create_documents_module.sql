CREATE TABLE IF NOT EXISTS document_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_documents (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  category_id INTEGER REFERENCES document_categories(id),
  file_url TEXT NOT NULL,
  file_name VARCHAR,
  issue_date DATE,
  expiry_date DATE,
  verification_status VARCHAR DEFAULT 'Pending',
  verified_by INTEGER REFERENCES users(id),
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO document_categories (name)
VALUES
  ('Aadhar Card'),
  ('PAN Card'),
  ('Resume'),
  ('Offer Letter'),
  ('Educational Certificate'),
  ('Bank Passbook')
ON CONFLICT (name) DO NOTHING;
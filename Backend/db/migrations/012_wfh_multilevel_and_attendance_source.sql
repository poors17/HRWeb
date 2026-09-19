ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS level2_manager_id INTEGER REFERENCES employees(id);

ALTER TABLE wfh_requests
  ADD COLUMN IF NOT EXISTS level1_status VARCHAR DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS level2_status VARCHAR DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS hr_status VARCHAR DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS level1_approved_by INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS level2_approved_by INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS hr_approved_by INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS level1_approved_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS level2_approved_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS hr_approved_at TIMESTAMP;

UPDATE wfh_requests
SET level1_status = CASE WHEN status = 'Approved' THEN 'Approved' ELSE 'Pending' END,
    level2_status = CASE WHEN status = 'Approved' THEN 'Approved' ELSE 'Pending' END,
    hr_status = CASE WHEN status = 'Approved' THEN 'Approved' ELSE 'Pending' END
WHERE level1_status = 'Pending'
  AND level2_status = 'Pending'
  AND hr_status = 'Pending'
  AND status = 'Approved';

UPDATE wfh_requests
SET level1_status = 'Rejected'
WHERE level1_status = 'Pending'
  AND level2_status = 'Pending'
  AND hr_status = 'Pending'
  AND status = 'Rejected';

CREATE OR REPLACE FUNCTION derive_wfh_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := CASE
    WHEN NEW.level1_status = 'Approved'
      AND NEW.level2_status = 'Approved'
      AND NEW.hr_status = 'Approved' THEN 'Approved'
    WHEN NEW.level1_status = 'Rejected'
      OR NEW.level2_status = 'Rejected'
      OR NEW.hr_status = 'Rejected' THEN 'Rejected'
    ELSE 'Pending'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wfh_requests_derive_status ON wfh_requests;
CREATE TRIGGER wfh_requests_derive_status
BEFORE INSERT OR UPDATE ON wfh_requests
FOR EACH ROW
EXECUTE FUNCTION derive_wfh_status();

UPDATE wfh_requests
SET level1_status = level1_status;

ALTER TABLE attendance
  ADD COLUMN IF NOT EXISTS login_source VARCHAR DEFAULT 'Web';

ALTER TABLE attendance
  ADD CONSTRAINT attendance_login_source_check
  CHECK (login_source IN ('Biometric', 'Web'));
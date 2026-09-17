BEGIN;

INSERT INTO departments (name)
VALUES ('Administration')
ON CONFLICT (name) DO NOTHING;

INSERT INTO designations (name, department_id)
SELECT 'Super Admin', d.id
FROM departments d
WHERE d.name = 'Administration'
  AND NOT EXISTS (
    SELECT 1
    FROM designations existing
    WHERE existing.name = 'Super Admin'
      AND existing.department_id = d.id
  );

INSERT INTO branches (name, location)
SELECT 'Head Office', NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM branches
  WHERE name = 'Head Office'
);

INSERT INTO shifts (name, start_time, end_time)
SELECT 'General', TIME '09:00:00', TIME '17:00:00'
WHERE NOT EXISTS (
  SELECT 1
  FROM shifts
  WHERE name = 'General'
);

INSERT INTO employees (
  employee_code,
  user_id,
  full_name,
  department_id,
  designation_id,
  branch_id,
  shift_id,
  employment_status
)
SELECT
  'EMP001',
  1,
  COALESCE(u.name, 'Admin User'),
  d.id,
  dg.id,
  b.id,
  s.id,
  'Active'
FROM users u
CROSS JOIN departments d
CROSS JOIN designations dg
CROSS JOIN branches b
CROSS JOIN shifts s
WHERE u.id = 1
  AND d.name = 'Administration'
  AND dg.name = 'Super Admin'
  AND dg.department_id = d.id
  AND b.name = 'Head Office'
  AND s.name = 'General'
ON CONFLICT (employee_code) DO NOTHING;

COMMIT;

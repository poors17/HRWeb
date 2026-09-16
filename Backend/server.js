require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const assetRoutes = require('./routes/assetRoutes');
const exitRoutes = require('./routes/exitRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const documentRoutes = require('./routes/documentRoutes');
const wfhRoutes = require('./routes/wfhRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://hrms-frontend-zvmc.onrender.com',
  'https://hrms-frontend-zvmc.onrender.com',
  'http://localhost:5173',
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api', organizationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api', recruitmentRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/exit', exitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/wfh', wfhRoutes);
app.use('/api/permission', permissionRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'hrms-backend' });
});

async function startServer() {
  try {
    await pool.query('SELECT 1');
    app.listen(port, () => {
      console.log(`HRMS backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;

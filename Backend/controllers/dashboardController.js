const dashboard = require('../db/queries/dashboard');

function handleError(res, error) {
  console.error('Unable to fetch dashboard summary:', error.message);
  return res.status(500).json({ message: 'Unable to fetch dashboard summary' });
}

async function getSummary(req, res) {
  try {
    const [employeeCounts, attendanceRows, requestCounts, departmentSummary, payrollStatus, openJobPostings] = await Promise.all([
      dashboard.getEmployeeCounts(),
      dashboard.getTodayAttendanceCounts(),
      dashboard.getPendingRequestCounts(),
      dashboard.getDepartmentSummary(),
      dashboard.getLatestPayrollStatus(),
      dashboard.getOpenJobPostingsCount(),
    ]);

    const todayAttendance = {
      Present: 0,
      Absent: 0,
      Late: 0,
      'Half-Day': 0,
      WFH: 0,
    };
    for (const row of attendanceRows) {
      if (Object.prototype.hasOwnProperty.call(todayAttendance, row.status)) {
        todayAttendance[row.status] = row.count;
      }
    }

    return res.json({
      totalEmployees: employeeCounts.total_employees,
      activeEmployees: employeeCounts.active_employees,
      inactiveEmployees: employeeCounts.inactive_employees,
      resignedEmployees: employeeCounts.resigned_employees,
      todayAttendance,
      pendingRequests: {
        leaveRequests: requestCounts.pending_leave_requests,
        exitRequests: requestCounts.pending_exit_requests,
      },
      departmentSummary,
      payrollStatus,
      openJobPostings,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = { getSummary };
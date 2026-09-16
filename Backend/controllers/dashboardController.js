const dashboard = require('../db/queries/dashboard');
const { getMyDashboardSummary: getEmployeeDashboardSummary } = require('../db/queries/employees');
const { getTodayAttendanceByEmployee } = require('../db/queries/attendance');

function handleError(res, error) {
  console.error('Unable to fetch dashboard summary:', error.message);
  return res.status(500).json({ message: 'Unable to fetch dashboard summary' });
}

function timeParts(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return { hours: value.getHours(), minutes: value.getMinutes() };
  }

  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  return match ? { hours: Number(match[1]), minutes: Number(match[2]) } : null;
}

function formatTime(value, includeLeadingHour = false) {
  const parts = timeParts(value);
  if (!parts) return null;

  const period = parts.hours >= 12 ? 'PM' : 'AM';
  const hour = parts.hours % 12 || 12;
  return `${includeLeadingHour ? String(hour).padStart(2, '0') : hour}:${String(parts.minutes).padStart(2, '0')} ${period}`;
}

function timeInMinutes(value) {
  const parts = timeParts(value);
  return parts ? parts.hours * 60 + parts.minutes : null;
}

function formatWorkingHours(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback;

  const totalMinutes = Math.max(0, Math.round(Number(value) * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatDate(date) {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${weekdays[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function getMyDashboardSummary(req, res) {
  try {
    const employee = await getEmployeeDashboardSummary(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: 'No employee record is linked to this user' });
    }

    const attendance = await getTodayAttendanceByEmployee(employee.employee_id);
    const punchInMinutes = timeInMinutes(attendance?.punch_in);
    const punchOutMinutes = timeInMinutes(attendance?.punch_out);
    const shiftStartMinutes = timeInMinutes(employee.shift_start_time);
    const shiftEndMinutes = timeInMinutes(employee.shift_end_time);
    const workingHours = formatWorkingHours(attendance?.working_hours);
    const workingHoursValue = Number(attendance?.working_hours);
    const shiftTime = employee.shift_start_time && employee.shift_end_time
      ? `${formatTime(employee.shift_start_time)} - ${formatTime(employee.shift_end_time, true)}`
      : null;
    const location = [employee.branch_name, employee.branch_location].filter(Boolean).join(', ') || null;

    return res.json({
      name: employee.full_name,
      employeeId: employee.employee_code,
      department: employee.department_name,
      date: formatDate(new Date()),
      status: attendance?.status || 'Not Marked',
      checkIn: formatTime(attendance?.punch_in, true),
      checkInStatus: punchInMinutes === null || shiftStartMinutes === null
        ? null
        : punchInMinutes <= shiftStartMinutes ? 'On Time' : 'Delay',
      checkOut: formatTime(attendance?.punch_out, true),
      checkOutStatus: punchOutMinutes === null || shiftEndMinutes === null
        ? null
        : punchOutMinutes >= shiftEndMinutes ? 'On Time' : 'Delay',
      workingHours,
      progress: Number.isFinite(workingHoursValue)
        ? Math.min(100, Math.round((workingHoursValue / 8) * 100))
        : 0,
      completedHours: workingHours || '0h 00m',
      requiredHours: '8h 00m',
      shiftTime,
      shiftName: employee.shift_name,
      location,
      profileImage: null,
    });
  } catch (error) {
    return handleError(res, error);
  }
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

module.exports = { getSummary, getMyDashboardSummary };
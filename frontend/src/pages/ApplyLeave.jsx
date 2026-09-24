import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Phone,
  Download,
} from "lucide-react";
import Layout from "../styles/Layout";

import "./ApplyLeave.css";
import calendarIcon from "../assets/dashboard/Vector.svg";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const formatDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  const dateObject = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return dateObject.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Not available";

  const dateObject = new Date(value);
  if (Number.isNaN(dateObject.getTime())) {
    return value;
  }

  return dateObject.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateDuration = (from, to) => {
  if (!from || !to) return 0;

  const fromDateObject = new Date(`${from}T00:00:00`);
  const toDateObject = new Date(`${to}T00:00:00`);
  const difference = toDateObject.getTime() - fromDateObject.getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

  return days > 0 ? days : 0;
};

const ApplyLeave = () => {
  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = React.useState([]);
  const [leaveType, setLeaveType] = React.useState("");
  const [leaveTypeId, setLeaveTypeId] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [handoverOptions, setHandoverOptions] = React.useState([]);
  const [handoverEmployeeId, setHandoverEmployeeId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const redirectToLogin = React.useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("empId");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  }, [navigate]);

  const effectiveToDate = toDate || fromDate;
  const duration = calculateDuration(fromDate, effectiveToDate);

  const handleFromDateChange = (value) => {
    setFromDate(value);

    if (toDate && value > toDate) {
      setToDate(value);
    }
  };

  const handleToDateChange = (value) => {
    if (fromDate && value < fromDate) {
      setToDate(fromDate);
      return;
    }

    setToDate(value);
  };

  const loadLeaveData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [leaveTypesResponse, leaveBalancesResponse, employeesResponse] = await Promise.all([
        fetch(`${API_URL}/api/leave/types`, {
          method: "GET",
          headers: getAuthHeaders(),
        }),
        fetch(`${API_URL}/api/leave/balance?year=${new Date().getFullYear()}`, {
          method: "GET",
          headers: getAuthHeaders(),
        }),
        fetch(`${API_URL}/api/employees?employment_status=Active`, {
          method: "GET",
          headers: getAuthHeaders(),
        }),
      ]);

      const leaveTypesData = await leaveTypesResponse.json().catch(() => ({}));
      const balancesData = await leaveBalancesResponse.json().catch(() => ({}));
      const employeesData = await employeesResponse.json().catch(() => ({}));

      if (leaveTypesResponse.status === 401 || leaveBalancesResponse.status === 401 || employeesResponse.status === 401) {
        setError("Your session has expired. Please sign in again.");
        redirectToLogin();
        return;
      }

      if (!leaveTypesResponse.ok) {
        throw new Error(leaveTypesData.message || "Unable to load leave types");
      }

      if (!leaveBalancesResponse.ok) {
        throw new Error(balancesData.message || "Unable to load leave balances");
      }

      if (!employeesResponse.ok) {
        throw new Error(employeesData.message || "Unable to load employees");
      }

      const mappedLeaveTypes = Array.isArray(leaveTypesData) ? leaveTypesData.map((item) => ({
        id: Number(item.id ?? item.leave_type_id),
        name: item.leave_type_name || item.name || "Leave",
        totalDays: Number(item.total_days ?? item.default_days_per_year ?? 0),
      })) : [];

      const mappedBalances = Array.isArray(balancesData) ? balancesData.map((item) => ({
        id: Number(item.leave_type_id ?? item.id),
        name: item.leave_type_name || item.name || "Leave",
        totalDays: Number(item.total_days ?? 0),
        usedDays: Number(item.used_days ?? 0),
        remaining: Number(item.remaining ?? (Number(item.total_days ?? 0) - Number(item.used_days ?? 0))),
      })) : [];

      const mappedHandoverOptions = Array.isArray(employeesData)
        ? employeesData
            .filter((employee) => employee?.employment_status === "Active")
            .filter((employee) => employee?.employee_code !== localStorage.getItem("empId"))
            .map((employee) => ({
              id: Number(employee.id),
              employeeCode: employee.employee_code,
              fullName: employee.full_name,
            }))
        : [];

      const balanceByTypeId = new Map(mappedBalances.map((item) => [item.id, item]));
      const leaveTypesWithBalance = mappedLeaveTypes.map((item) => {
        const balance = balanceByTypeId.get(item.id);
        return balance
          ? { ...item, totalDays: balance.totalDays || item.totalDays, remaining: balance.remaining }
          : item;
      });

      setLeaveTypes(leaveTypesWithBalance);
      setHandoverOptions(mappedHandoverOptions);

      if (mappedLeaveTypes.length > 0) {
        const defaultType = mappedLeaveTypes[0];
        setLeaveType(defaultType.name);
        setLeaveTypeId(String(defaultType.id));
      }

      if (mappedHandoverOptions.length > 0) {
        setHandoverEmployeeId((current) => current || String(mappedHandoverOptions[0].id));
      }

      if (mappedLeaveTypes.length === 0 && mappedBalances.length > 0) {
        setLeaveTypes(mappedBalances);
      }
    } catch (loadError) {
      setError(loadError.message || "Unable to load leave data");
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  React.useEffect(() => {
    loadLeaveData();
  }, [loadLeaveData]);

  const handleSubmitLeave = async () => {
    if (!leaveTypeId || !fromDate || !reason.trim()) {
      setSubmitError("Please fill all required leave fields.");
      return;
    }

    if (!toDate && fromDate) {
      setSubmitError("");
    }

    const effectiveDuration = calculateDuration(fromDate, toDate || fromDate);

    if (effectiveDuration <= 0) {
      setSubmitError("End date must be on or after the start date.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await fetch(`${API_URL}/api/leave/apply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          leaveTypeId: Number(leaveTypeId),
          startDate: fromDate,
          endDate: toDate || fromDate,
          totalDays: effectiveDuration,
          reason: reason.trim(),
          handoverEmployeeId: handoverEmployeeId ? Number(handoverEmployeeId) : null,
          contactNumber: contactNumber.trim() || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || /Invalid or expired authentication token/i.test(data.message || "")) {
        setSubmitError("Your session has expired. Please sign in again.");
        redirectToLogin();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit leave request");
      }

      navigate("/leave-submitted", {
        state: {
          leaveRequest: data,
          leaveType: leaveType || data.leave_type_name || "Leave",
          fromDate: formatDate(data.start_date || fromDate),
          toDate: formatDate(data.end_date || toDate || fromDate),
          duration: `${Number(data.total_days ?? effectiveDuration)} ${Number(data.total_days ?? effectiveDuration) === 1 ? "Day" : "Days"}`,
          appliedOn: formatDateTime(data.created_at),
          status: data.status || "Pending",
        },
      });
    } catch (submitErrorMessage) {
      setSubmitError(submitErrorMessage.message || "Unable to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="apply-leave-page">
        <section className="apply-leave-heading">
          <div className="apply-leave-breadcrumb">
            <button
              type="button"
              className="apply-leave-breadcrumb-back"
              onClick={() => navigate("/employee-dashboard")}
              aria-label="Go back"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>

            <button
              type="button"
              className="apply-leave-breadcrumb-parent"
              onClick={() => navigate("/employee-dashboard")}
            >
              Leave Management
            </button>

            <span className="apply-leave-breadcrumb-separator">&gt;</span>
            <span className="apply-leave-breadcrumb-current">Apply Leave</span>
          </div>

          <div className="apply-leave-title">
            <h1>Apply for Leave</h1>
            <p>Fill in the details below to submit your leave request.</p>
          </div>
        </section>

        <section className="apply-leave-grid">
          <div className="apply-leave-form-card">
            <div className="apply-leave-form-row">
              <label>
                Leave Type <span>*</span>
              </label>

              <div className="apply-leave-select-wrapper">
                <select
                  value={leaveType}
                  onChange={(event) => {
                    const selected = leaveTypes.find(
                      (item) => item.name === event.target.value
                    );
                    setLeaveType(event.target.value);
                    setLeaveTypeId(selected ? String(selected.id) : "");
                  }}
                  disabled={loading || leaveTypes.length === 0}
                >
                  {leaveTypes.length === 0 ? (
                    <option value="">No leave types available</option>
                  ) : (
                    leaveTypes.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown className="apply-leave-select-arrow" size={18} strokeWidth={2.5} />
              </div>
            </div>

            <div className="apply-leave-form-row">
              <label>
                From Date <span>*</span>
              </label>

              <div className="apply-leave-date-wrapper">
                <input
                  type="text"
                  value={formatDate(fromDate)}
                  readOnly
                  className="apply-leave-date-display"
                />

                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => handleFromDateChange(event.target.value)}
                  className="apply-leave-native-date"
                  max={toDate || undefined}
                />

                <img src={calendarIcon} alt="Calendar" className="apply-leave-calendar-icon" />
              </div>
            </div>

            <div className="apply-leave-form-row">
              <label>
                To Date <span>*</span>
              </label>

              <div className="apply-leave-date-wrapper">
                <input
                  type="text"
                  value={formatDate(toDate)}
                  readOnly
                  className="apply-leave-date-display"
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => handleToDateChange(event.target.value)}
                  className="apply-leave-native-date"
                  min={fromDate || undefined}
                />

                <img src={calendarIcon} alt="Calendar" className="apply-leave-calendar-icon" />
              </div>
            </div>

            <div className="apply-leave-form-row">
              <label>Duration</label>
              <div className="apply-leave-duration">
                {duration} {duration === 1 ? "Day" : "Days"}
              </div>
            </div>

            <div className="apply-leave-form-row apply-leave-reason-row">
              <label>
                Reason <span>*</span>
              </label>

              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="reason of leave"
              />
            </div>
          </div>

          <div className="apply-leave-right-column">
            <div className="apply-leave-balance-card">
              <div className="apply-leave-balance-header">Leave Balance</div>

              <div className="apply-leave-balance-content">
                {loading ? (
                  <div>Loading leave balances...</div>
                ) : error ? (
                  <div>{error}</div>
                ) : leaveTypes.length === 0 ? (
                  <div>No leave balances available.</div>
                ) : (
                  leaveTypes.map((item) => {
                    const available = Math.max(item.remaining ?? item.totalDays ?? 0, 0);
                    const total = Number(item.totalDays ?? item.remaining ?? 0);
                    return (
                      <div key={item.id} className="apply-leave-balance-row">
                        <span>{item.name}</span>
                        <strong>
                          {available} <small>/ {total} days</small>
                        </strong>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="apply-leave-handover">
              <label>Work Handover To</label>

              <div className="apply-leave-handover-select">
                <select
                  value={handoverEmployeeId}
                  onChange={(event) => setHandoverEmployeeId(event.target.value)}
                  disabled={handoverOptions.length === 0}
                >
                  {handoverOptions.length === 0 ? (
                    <option value="">No employees available</option>
                  ) : (
                    handoverOptions.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName} (ID - {employee.employeeCode})
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown size={18} strokeWidth={2.5} className="apply-leave-handover-arrow" />
              </div>
            </div>
          </div>
        </section>

        <section className="apply-leave-contact">
          <label>Contact During Leave</label>

          <div className="apply-leave-contact-input">
            <Phone size={21} strokeWidth={2} color="#66696B" />
            <input
              type="text"
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              placeholder="+91"
            />
          </div>
        </section>

        <section className="apply-leave-actions">
          <button type="button" className="apply-leave-cancel" onClick={() => navigate("/employee-dashboard")}>
            Cancel
          </button>

          <button type="button" className="apply-leave-submit" onClick={handleSubmitLeave} disabled={submitting || loading}>
            <Download size={22} strokeWidth={2.5} />
            <span>{submitting ? "Submitting..." : "Submit Leave"}</span>
          </button>
        </section>

        {submitError ? <div style={{ marginTop: "12px", color: "#d93025" }}>{submitError}</div> : null}
      </div>
    </Layout>
  );
};

export default ApplyLeave;
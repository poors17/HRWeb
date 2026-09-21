import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveDetails.css";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const formatDateValue = (value) => {
  if (!value) return "";

  const dateObject = new Date(value);
  if (Number.isNaN(dateObject.getTime())) return value;

  return dateObject.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Not available";

  const dateObject = new Date(value);
  if (Number.isNaN(dateObject.getTime())) return value;

  return dateObject.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LeaveDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [leaveRequest, setLeaveRequest] = React.useState(
    location.state?.leaveRequest || location.state?.request || null
  );
  const [employeeProfile, setEmployeeProfile] = React.useState(null);
  const [handoverProfile, setHandoverProfile] = React.useState(null);
  const [balances, setBalances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadLeaveData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [requestsResponse, balancesResponse] = await Promise.all([
        fetch(`${API_URL}/api/leave/my`, {
          method: "GET",
          headers: getAuthHeaders(),
        }),
        fetch(`${API_URL}/api/leave/balance?year=${new Date().getFullYear()}`, {
          method: "GET",
          headers: getAuthHeaders(),
        }),
      ]);

      const requestsData = await requestsResponse.json().catch(() => ({}));
      const balancesData = await balancesResponse.json().catch(() => ({}));

      if (requestsResponse.status === 401 || balancesResponse.status === 401) {
        setError("Your session has expired. Please sign in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/login", { replace: true });
        return;
      }

      if (!requestsResponse.ok) {
        throw new Error(requestsData.message || "Unable to load leave requests");
      }

      if (!balancesResponse.ok) {
        throw new Error(balancesData.message || "Unable to load leave balances");
      }

      const myRequests = Array.isArray(requestsData) ? requestsData : [];
      const myBalances = Array.isArray(balancesData) ? balancesData : [];

      setBalances(myBalances);

      const selectedRequest = leaveRequest || myRequests[0] || null;
      if (selectedRequest && !leaveRequest) {
        setLeaveRequest(selectedRequest);
      }

      if (selectedRequest) {
        if (selectedRequest.employee_id) {
          const employeeResponse = await fetch(`${API_URL}/api/employees/${selectedRequest.employee_id}`, {
            headers: getAuthHeaders(),
          });
          const employeeData = await employeeResponse.json().catch(() => null);
          if (employeeResponse.ok && employeeData) {
            setEmployeeProfile(employeeData);
          }
        }

        if (selectedRequest.handover_employee_id) {
          const handoverResponse = await fetch(`${API_URL}/api/employees/${selectedRequest.handover_employee_id}`, {
            headers: getAuthHeaders(),
          });
          const handoverData = await handoverResponse.json().catch(() => null);
          if (handoverResponse.ok && handoverData) {
            setHandoverProfile(handoverData);
          }
        }
      }
    } catch (loadError) {
      setError(loadError.message || "Unable to load leave details");
    } finally {
      setLoading(false);
    }
  }, [leaveRequest, navigate]);

  React.useEffect(() => {
    loadLeaveData();
  }, [loadLeaveData]);

  const leaveType = leaveRequest?.leave_type_name || location.state?.leaveType || "Leave";
  const fromDate = leaveRequest?.start_date
    ? formatDateValue(leaveRequest.start_date)
    : location.state?.fromDate || "";
  const toDate = leaveRequest?.end_date
    ? formatDateValue(leaveRequest.end_date)
    : location.state?.toDate || "";
  const duration = leaveRequest?.total_days
    ? `${Number(leaveRequest.total_days)} ${Number(leaveRequest.total_days) === 1 ? "Day" : "Days"}`
    : location.state?.duration || "";
  const reason = leaveRequest?.reason || "Not provided";
  const status = leaveRequest?.status || "Pending";
  const appliedOn = leaveRequest?.created_at ? formatDateTime(leaveRequest.created_at) : "Not available";
  const employeeName = employeeProfile?.full_name || leaveRequest?.employee_name || "Employee Name";
  const employeeCode = employeeProfile?.employee_code || leaveRequest?.employee_code || "-";
  const departmentName = employeeProfile?.department_name || "Not assigned";
  const designationName = employeeProfile?.designation_name || "Not assigned";
  const reportingManagerName = leaveRequest?.reporting_manager_name || "Not assigned";
  const contactNumber = leaveRequest?.contact_number || null;
  const handoverName = leaveRequest?.handover_employee_name || handoverProfile?.full_name || null;
  const handoverCode = leaveRequest?.handover_employee_code || handoverProfile?.employee_code || null;
  const hasHandover = Boolean(handoverName && handoverCode);
  const hasAppliedVia = Boolean(leaveRequest?.applied_via);
  const approvalRecordExists = Boolean(
    leaveRequest?.approved_by && (leaveRequest?.approved_at || leaveRequest?.updated_at)
  );
  const managerStepCompleted = Boolean(
    leaveRequest?.approved_by && (status === "Manager Approved" || status === "HR Approved" || status === "Rejected") && (leaveRequest?.approved_at || leaveRequest?.updated_at)
  );
  const hrStepCompleted = Boolean(
    leaveRequest?.approved_by && (status === "HR Approved" || status === "Rejected") && (leaveRequest?.approved_at || leaveRequest?.updated_at)
  );
  const approverName = leaveRequest?.approver_name || leaveRequest?.approver_employee_name || null;

  return (
    <Layout>
      <div className="leave-details-page">
        <div className="leave-details-breadcrumb">
          <button type="button" className="leave-details-back" onClick={() => navigate("/employee-dashboard")}>
            ←
          </button>

          <span className="leave-details-breadcrumb-blue">Leave Management</span>
          <span className="leave-details-breadcrumb-arrow">&gt;</span>
          <span className="leave-details-breadcrumb-current">Leave Details</span>
        </div>

        <div className="leave-details-header">
          <div>
            <h1>Leave Details</h1>
            <p>Complete information about the leave request, application details and approval status.</p>
          </div>

          <div className="leave-details-header-status">
            <span className="leave-id-badge">Leave ID: {leaveRequest?.id || "-"}</span>
            <span className="approved-badge">✓ {status}</span>
          </div>
        </div>

        <div className="leave-details-employee">
          <div className="leave-details-profile">
            <div className="leave-details-avatar">
              <span>👤</span>
            </div>

            <div className="leave-details-employee-name">
              <h2>{employeeName}</h2>
              <p>ID - {employeeCode}</p>
              <span>{designationName}</span>
            </div>
          </div>

          <div className="leave-details-employee-info">
            <div>
              <small>Department</small>
              <strong>{departmentName}</strong>
            </div>
            <div>
              <small>Designation</small>
              <strong>{designationName}</strong>
            </div>
            <div>
              <small>Reporting Manager</small>
              <strong>{reportingManagerName}</strong>
            </div>
            <div>
              <small>Date of Joining</small>
              <strong>{employeeProfile?.date_of_joining ? formatDateValue(employeeProfile.date_of_joining) : "Not available"}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "20px 0" }}>Loading leave details...</div>
        ) : error ? (
          <div style={{ padding: "20px 0", color: "#d93025" }}>{error}</div>
        ) : !leaveRequest ? (
          <div style={{ padding: "20px 0" }}>No leave request found.</div>
        ) : (
          <div className="leave-details-content">
            <section className="leave-details-card">
              <div className="leave-details-card-header">
                <span className="leave-details-card-icon">📅</span>
                <h3>Leave information</h3>
                <button type="button">Edit Request</button>
              </div>

              <div className="leave-info-list">
                <div className="leave-info-row">
                  <span>Leave Type</span>
                  <strong className="leave-type-blue">{leaveType}</strong>
                </div>

                <div className="leave-info-row">
                  <span>From Date</span>
                  <strong>{fromDate}</strong>
                </div>

                <div className="leave-info-row">
                  <span>To Date</span>
                  <strong>{toDate}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Duration</span>
                  <strong>{duration}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Reason</span>
                  <strong className="leave-reason">{reason}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Status</span>
                  <strong className="leave-approved-small">✓ {status}</strong>
                </div>
              </div>
            </section>

            <section className="leave-details-card">
              <div className="leave-details-card-header">
                <span className="leave-details-card-icon">📄</span>
                <h3>Apply Leave Details</h3>
              </div>

              <div className="leave-info-list">
                <div className="leave-info-row">
                  <span>Applied On</span>
                  <strong>{appliedOn}</strong>
                </div>

                {hasAppliedVia ? (
                  <div className="leave-info-row">
                    <span>Applied Via</span>
                    <strong>{leaveRequest.applied_via}</strong>
                  </div>
                ) : null}

                {contactNumber ? (
                  <div className="leave-info-row">
                    <span>Contact During Leave</span>
                    <strong>{contactNumber}</strong>
                  </div>
                ) : null}

                <div className="leave-info-row">
                  <span>Work Handover</span>
                  <strong className="leave-approved-small">{hasHandover ? "✓ Assigned" : "Not assigned"}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Handover To</span>
                  <strong>{hasHandover ? `${handoverName} (${handoverCode})` : "Not assigned"}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Remark</span>
                  <strong className="leave-reason">
                    {reason || "No remark provided."}
                  </strong>
                </div>
              </div>
            </section>

            <section className="leave-details-card leave-approval-card">
              <div className="leave-details-card-header">
                <span className="leave-details-card-icon">👥</span>
                <h3>Approval Status</h3>
                <span className="approval-header-text">✓ Your leave is {status.toLowerCase()}.</span>
              </div>

              <div className="approval-timeline">
                <div className="approval-item">
                  <div className="approval-line">
                    <span className="approval-circle">✓</span>
                  </div>
                  <div className="approval-content">
                    <h4>Leave Applied</h4>
                    <p>{appliedOn}</p>
                    <span>Leave request submitted by {employeeName}.</span>
                  </div>
                  <div className="approval-person">
                    <div className="approval-person-avatar">👤</div>
                    <div>
                      <strong>{employeeName}</strong>
                      <span>Employee</span>
                    </div>
                  </div>
                </div>

                <div className="approval-item">
                  <div className="approval-line">
                    <span className="approval-circle" style={{ background: managerStepCompleted ? '#20A765' : '#C7CCD1' }}>
                      {managerStepCompleted ? '✓' : '•'}
                    </span>
                  </div>
                  <div className="approval-content">
                    <h4>Reviewed by Manager</h4>
                    <p>{managerStepCompleted ? (leaveRequest?.updated_at ? formatDateTime(leaveRequest.updated_at) : appliedOn) : "Waiting for manager review"}</p>
                    <span>{managerStepCompleted && approverName ? `Reviewed by ${approverName}.` : "Pending manager review."}</span>
                  </div>
                  <div className="approval-person">
                    <div className="approval-person-avatar">👤</div>
                    <div>
                      <strong>{approverName || "Manager"}</strong>
                      <span>{approverName ? "Approver" : "Pending"}</span>
                    </div>
                  </div>
                </div>

                <div className="approval-item">
                  <div className="approval-line">
                    <span className="approval-circle" style={{ background: hrStepCompleted ? '#20A765' : '#C7CCD1' }}>
                      {hrStepCompleted ? '✓' : '•'}
                    </span>
                  </div>
                  <div className="approval-content">
                    <h4>Status</h4>
                    <p>{hrStepCompleted ? (leaveRequest?.updated_at ? formatDateTime(leaveRequest.updated_at) : appliedOn) : "Waiting for HR / Manager update"}</p>
                    <span>{hrStepCompleted ? status : "Pending decision."}</span>
                  </div>
                  <div className="approval-person">
                    <div className="approval-person-avatar">👤</div>
                    <div>
                      <strong>{approverName || "HR / Manager"}</strong>
                      <span>{approverName ? "Approver" : "Pending"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveDetails;
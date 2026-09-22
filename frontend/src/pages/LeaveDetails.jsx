import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveDetails.css";
import dateRangeIcon from "../assets/cards/date-range.svg";

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

  const requestedLeaveId = React.useMemo(() => {
    const searchParams = new URLSearchParams(location.search || "");
    const queryId = searchParams.get("id");

    if (queryId && queryId !== "undefined") {
      return Number(queryId);
    }

    const stateId =
      location.state?.leaveRequest?.id ||
      location.state?.request?.id ||
      location.state?.leaveId ||
      location.state?.id ||
      null;

    return stateId ? Number(stateId) : null;
  }, [location.search, location.state]);

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

      const selectedRequest = requestedLeaveId
        ? myRequests.find((request) => Number(request.id) === Number(requestedLeaveId)) ||
          leaveRequest ||
          location.state?.leaveRequest ||
          location.state?.request ||
          myRequests[0] ||
          null
        : leaveRequest || location.state?.leaveRequest || location.state?.request || myRequests[0] || null;

      if (!selectedRequest) {
        setLeaveRequest(null);
        setError("No leave requests found.");
        return;
      }

      if (!leaveRequest || Number(leaveRequest.id) !== Number(selectedRequest.id)) {
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
  const departmentName = employeeProfile?.department_name || leaveRequest?.department_name || "Not assigned";
  const designationName = employeeProfile?.designation_name || leaveRequest?.designation_name || "Not assigned";
  const reportingManagerName =
    leaveRequest?.reporting_manager_name ||
    employeeProfile?.reporting_manager_name ||
    employeeProfile?.manager_name ||
    "Not assigned";
  const contactNumber = leaveRequest?.contact_number || null;
  const handoverName = leaveRequest?.handover_employee_name || handoverProfile?.full_name || null;
  const handoverCode = leaveRequest?.handover_employee_code || handoverProfile?.employee_code || null;
  const hasHandover = Boolean(handoverName && handoverCode);
  const hasAppliedVia = Boolean(leaveRequest?.applied_via);
  const approvalRecordExists = Boolean(
    leaveRequest?.approved_by && (leaveRequest?.approved_at || leaveRequest?.updated_at)
  );
  const managerStepCompleted = Boolean(
    leaveRequest?.approved_by &&
      (status === "Manager Approved" || status === "HR Approved" || status === "Rejected" || status === "Approved") &&
      (leaveRequest?.approved_at || leaveRequest?.updated_at)
  );
  const hrStepCompleted = Boolean(
    leaveRequest?.approved_by &&
      (status === "HR Approved" || status === "Rejected" || status === "Approved") &&
      (leaveRequest?.approved_at || leaveRequest?.updated_at)
  );
  const approverName = leaveRequest?.approver_name || leaveRequest?.approver_employee_name || null;
  const approvalStatusText = approvalRecordExists
    ? `Your leave is ${status.toLowerCase()}.`
    : "Your leave is pending review.";

  const balanceEntries = Array.isArray(balances) ? balances : [];
  const attachments = Array.isArray(leaveRequest?.attachments) ? leaveRequest.attachments : [];

  const renderStatusBadge = (done, text) => (
    <strong className="leave-approved-small">
      {done ? (
        <svg width="20" height="20" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="13" r="12.5" fill="#218257" />
          <path d="M7 13L10.5 16.5L18 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <span>{text}</span>
    </strong>
  );

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
          <div className="leave-details-header-content">
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
                <img src={dateRangeIcon} alt="Date Range" className="leave-details-card-icon" />
                <h3>Leave information</h3>
                <button type="button" className="edit-request-button">
                  <span>Edit Request</span>
                </button>
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
                  {renderStatusBadge(Boolean(status), status)}
                </div>
              </div>
            </section>

            <section className="leave-details-card apply-leave-details-card">
              <div className="leave-details-card-header">
                <span className="leave-details-card-icon">📄</span>
                <h3>Apply Leave Details</h3>
              </div>

              <div className="leave-info-list">
                <div className="leave-info-row">
                  <span>Applied On</span>
                  <strong>{appliedOn}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Applied Via</span>
                  <strong>Employee Portal (web)</strong>
                </div>

                {contactNumber ? (
                  <div className="leave-info-row">
                    <span>Contact During Leave</span>
                    <strong>{contactNumber}</strong>
                  </div>
                ) : null}

                <div className="leave-info-row">
                  <span>Work Handover</span>
                  <strong className="leave-approved-small">
                    {hasHandover ? (
                      <>
                        <svg width="20" height="20" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12.5" cy="13" r="12.5" fill="#218257" />
                          <path d="M7 13L10.5 16.5L18 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Assigned</span>
                      </>
                    ) : (
                      <span>Not assigned</span>
                    )}
                  </strong>
                </div>

                <div className="leave-info-row">
                  <span>Handover To</span>
                  <strong>{hasHandover ? `${handoverName} (${handoverCode})` : "Not assigned"}</strong>
                </div>

                <div className="leave-info-row">
                  <span>Remark</span>
                  <strong className="apply-leave-remark">{leaveRequest?.remark || reason || "No remark provided."}</strong>
                </div>
              </div>
            </section>

            <section className="leave-details-card leave-approval-card">
              <div className="leave-details-card-header">
                <span className="leave-details-card-icon">👥</span>
                <h3>Approval Status</h3>
                <span className="approval-header-text">
                  {approvalRecordExists ? (
                    <>
                      <svg width="17.25" height="17.25" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="approval-header-check">
                        <circle cx="12.5" cy="13" r="12.5" fill="#218257" />
                        <path d="M7 13L10.5 16.5L18 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{approvalStatusText}</span>
                    </>
                  ) : (
                    <span>{approvalStatusText}</span>
                  )}
                </span>
              </div>

              <div className="approval-timeline">
                <div className="approval-item">
                  <div className="approval-line">
                    <span className="approval-circle">
                      <svg width="14" height="14" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 13L10.5 16.5L18 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
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
                    <span
                      className="approval-circle"
                      style={{ background: managerStepCompleted ? "#20A765" : "#C7CCD1" }}
                    >
                      {managerStepCompleted ? "✓" : "•"}
                    </span>
                  </div>
                  <div className="approval-content">
                    <h4>Reviewed by Manager</h4>
                    <p>
                      {managerStepCompleted
                        ? leaveRequest?.updated_at
                          ? formatDateTime(leaveRequest.updated_at)
                          : appliedOn
                        : "Waiting for manager review"}
                    </p>
                    <span>
                      {managerStepCompleted && approverName
                        ? `Reviewed by ${approverName}.`
                        : "Pending manager review."}
                    </span>
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
                    <span
                      className="approval-circle"
                      style={{ background: hrStepCompleted ? "#20A765" : "#C7CCD1" }}
                    >
                      {hrStepCompleted ? "✓" : "•"}
                    </span>
                  </div>
                  <div className="approval-content">
                    <h4>{status === "Rejected" ? "Decision" : "Status"}</h4>
                    <p>
                      {hrStepCompleted
                        ? leaveRequest?.updated_at
                          ? formatDateTime(leaveRequest.updated_at)
                          : appliedOn
                        : "Waiting for HR / Manager update"}
                    </p>
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

            <section className="leave-details-card leave-balance-card">
              <div className="leave-details-card-header leave-balance-header">
                <span className="leave-balance-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#1B70F5" />
                    <path d="M12 2V12H22" fill="#C6E8FA" />
                  </svg>
                </span>

                <h3>Leave Balance</h3>

                <span className="leave-balance-date">
                  (as of {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })})
                </span>
              </div>

              <div className="leave-balance-content">
                {balanceEntries.length ? (
                  balanceEntries.map((item, index) => {
                    const label = item.leave_type_name || item.leave_type || item.name || `Leave ${index + 1}`;
                    const total = Number(item.total_days ?? item.total ?? 0);
                    const used = Number(item.used_days ?? item.used ?? 0);
                    const remaining = Number(item.remaining_days ?? item.remaining ?? Math.max(total - used, 0));
                    const progress = total > 0 ? Math.min((used / total) * 100, 100) : 0;

                    return (
                      <div key={`${label}-${index}`} className="leave-balance-row">
                        <div className="leave-balance-row-top">
                          <span>{label}</span>
                          <strong>
                            {remaining} <small>/ {total} Days</small>
                          </strong>
                        </div>
                        <div className="leave-balance-progress">
                          <div className="leave-balance-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="leave-balance-row">
                    <div className="leave-balance-row-top">
                      <span>No balance data available</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="leave-details-attachment-card">
              <div className="attachment-header">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="attachment-header-icon">
                  <path d="M21.44 11.05L12.25 20.24C10.3 22.19 7.14 22.19 5.19 20.24C3.24 18.29 3.24 15.13 5.19 13.18L14.38 3.99C15.69 2.68 17.81 2.68 19.12 3.99C20.43 5.3 20.43 7.42 19.12 8.73L9.93 17.92C9.28 18.57 8.22 18.57 7.57 17.92C6.92 17.27 6.92 16.21 7.57 15.56L16.05 7.08" stroke="#1B70F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>Attachment</h3>
              </div>

              <div className="attachment-list">
                {attachments.length ? (
                  attachments.map((file, index) => (
                    <div className="attachment-file-card" key={`${file.name || "attachment"}-${index}`}>
                      <div className="attachment-pdf-icon">
                        <span>File</span>
                      </div>

                      <div className="attachment-file-info">
                        <div className="attachment-file-name">{file.name || "Attachment"}</div>
                        <div className="attachment-file-meta">
                          {file.size || "-"} | {file.date || formatDateValue(file.created_at || file.uploaded_at) || "-"}
                        </div>
                      </div>

                      <a href={file.url || "#"} download={file.name || "attachment"} className="attachment-download-button" aria-label={`Download ${file.name || "attachment"}`}>
                        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="22" height="22" rx="5" fill="#C6E8FA" />
                          <path d="M12 5V15" stroke="#1B70F5" strokeWidth="2" strokeLinecap="round" />
                          <path d="M8 11L12 15L16 11" stroke="#1B70F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 18H17" stroke="#1B70F5" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="attachment-file-meta" style={{ padding: "12px 8px", textAlign: "center" }}>No attachments</div>
                )}
              </div>
            </section>

            <div className="leave-details-actions">
              <button type="button" className="download-leave-button">
                <span>Download Leave Details</span>
              </button>

              <button type="button" className="cancel-leave-button">
                <span>Cancel Leave</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveDetails;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../styles/Layout";
import "./LeaveDetails.css";

/* ==========================================================
   LEAVE DETAILS ASSETS
   ========================================================== */

import dateRangeIcon from "../assets/Leave Detils Assets/calender.svg";
import attachmentIcon from "../assets/Leave Detils Assets/Attachment.svg";
import fileIcon from "../assets/Leave Detils Assets/File.svg";
import downloadSymbol from "../assets/Leave Detils Assets/download-symbol.svg";
import peopleIcon from "../assets/Leave Detils Assets/People.svg";
import documentIcon from "../assets/Leave Detils Assets/document.svg";
import approvedIcon from "../assets/Leave Detils Assets/approved.svg";
import leaveDownloadIcon from "../assets/Leave Detils Assets/download leave detils.svg";
import deleteIcon from "../assets/Leave Detils Assets/delete.svg";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});


const formatDateValue = (value) => {
  if (!value) return "";

  const dateObject = new Date(value);

  if (Number.isNaN(dateObject.getTime())) {
    return value;
  }

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


const LeaveDetails = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [leaveRequest, setLeaveRequest] = React.useState(null);
  const [employeeProfile, setEmployeeProfile] = React.useState(null);
  const [handoverProfile, setHandoverProfile] = React.useState(null);
  const [balances, setBalances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");


  // ==========================================================
  // LOAD LEAVE DATA
  // API / BACKEND CODE IS NOT CHANGED
  // ==========================================================

  const loadLeaveData = React.useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      /* =========================================================
         ORIGINAL BACKEND API CODE - COMMENTED FOR FRONTEND WORK
      =========================================================

      const [requestsResponse, balancesResponse] = await Promise.all([
        fetch(`${API_URL}/api/leave/my`, {
          method: "GET",
          headers: getAuthHeaders()
        }),

        fetch(
          `${API_URL}/api/leave/balance?year=${new Date().getFullYear()}`,
          {
            method: "GET",
            headers: getAuthHeaders()
          }
        ),
      ]);

      ========================================================= */


      // DUMMY DATA FOR FRONTEND UI

      const dummyLeaveRequest = {

        id: "ID Number",

        status: "Approved",

        leave_type_name: "Casual Leave",

        start_date: "2026-09-18",

        end_date: "2026-09-19",

        total_days: 2,

        reason:
          "Personal work at my home town. I need to stay there for some important personal and family responsibilities. I have several things to complete during this period and I will not be available for regular work. Please consider my leave request and approve it.",

        created_at: "2026-09-15T10:32:00",

        applied_via: "Employee Portal (web)",

        contact_number: "+91 12345 67890",

        handover_employee_name: "Demo name",

        handover_employee_code: "001010",

        remark:
          "I will be available on phone for urgent discussions. During my leave period, I may have limited access to the system. Please contact me if there is anything urgent or important that requires my attention. I will respond whenever possible and will complete any pending work after I return.",

        approved_by: "Sriram Sir",

        updated_at: "2026-09-15T10:31:00",

        attachments: [
          {
            name: "Leave_Request_Form.pdf",
            size: "245 KB",
            date: "15 sep 2026",
          },
          {
            name: "HR_Document_Form.pdf",
            size: "201 KB",
            date: "15 sep 2026",
          },
          {
            name: "WFH_Request_Form.pdf",
            size: "245 KB",
            date: "15 sep 2026",
          },
        ],
      };


      const dummyEmployee = {

        full_name: "Employee Name",

        employee_code: "001010",

        department_name: "IT",

        designation_name: "Software Engineer",

        reporting_manager_name: "Ruthrasri",

        date_of_joining: "2026-06-12",
      };


      const dummyBalances = [

        {
          leave_type_name: "Casual Leave",
          total_days: 12,
          used_days: 4,
          remaining_days: 8,
        },

        {
          leave_type_name: "Sick Leave",
          total_days: 12,
          used_days: 6,
          remaining_days: 6,
        },

        {
          leave_type_name: "Annual Leave",
          total_days: 20,
          used_days: 6,
          remaining_days: 14,
        },

        {
          leave_type_name: "Compensatory leave",
          total_days: 12,
          used_days: 4,
          remaining_days: 8,
        },
      ];


      setTimeout(() => {

        setLeaveRequest(dummyLeaveRequest);

        setEmployeeProfile(dummyEmployee);

        setBalances(dummyBalances);

        setLoading(false);

      }, 500);


    } catch (loadError) {

      setError("Unable to load leave details");

      setLoading(false);

    }

  }, []);


  React.useEffect(() => {

    loadLeaveData();

  }, [loadLeaveData]);


  const leaveType =
    leaveRequest?.leave_type_name || "Leave";

  const fromDate =
    leaveRequest?.start_date
      ? formatDateValue(leaveRequest.start_date)
      : "";

  const toDate =
    leaveRequest?.end_date
      ? formatDateValue(leaveRequest.end_date)
      : "";

  const duration =
    leaveRequest?.total_days
      ? `${Number(leaveRequest.total_days)} Days`
      : "";

  const reason =
    leaveRequest?.reason || "Not provided";

  const status =
    leaveRequest?.status || "Approved";

  const appliedOn =
    leaveRequest?.created_at
      ? formatDateTime(leaveRequest.created_at)
      : "Not available";

  const employeeName =
    employeeProfile?.full_name || "Employee Name";

  const employeeCode =
    employeeProfile?.employee_code || "001010";

  const departmentName =
    employeeProfile?.department_name || "IT";

  const designationName =
    employeeProfile?.designation_name || "Software Engineer";

  const reportingManagerName =
    employeeProfile?.reporting_manager_name || "Ruthrasri";

  const contactNumber =
    leaveRequest?.contact_number || null;

  const handoverName =
    leaveRequest?.handover_employee_name || null;

  const handoverCode =
    leaveRequest?.handover_employee_code || null;

  const hasHandover =
    Boolean(handoverName && handoverCode);

  const approvalRecordExists = true;

  const managerStepCompleted = true;

  const hrStepCompleted = true;

  const approverName = "Sriram";

  const approvalStatusText =
    "Your leave has been approved.";


  const balanceEntries =
    Array.isArray(balances)
      ? balances
      : [];


  const attachments =
    Array.isArray(leaveRequest?.attachments)
      ? leaveRequest.attachments
      : [];


  const renderStatusBadge = (done, text) => (

    <strong className="leave-approved-small">

      {done ? (

        <img
          src={approvedIcon}
          alt=""
          aria-hidden="true"
        />

      ) : null}

      <span>{text}</span>

    </strong>
  );


  return (

    <Layout>

      <div className="leave-details-page">


        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="leave-details-breadcrumb">

          <button
            type="button"
            className="leave-details-back"
            onClick={() =>
              navigate("/employee-dashboard")
            }
          >
            ←
          </button>


          <button
            type="button"
            className="leave-details-breadcrumb-blue"
            onClick={() =>
              navigate("/employee-dashboard")
            }
          >
            Leave Management
          </button>


          <span className="leave-details-breadcrumb-arrow">
            &gt;
          </span>


          <span className="leave-details-breadcrumb-current">
            Leave Details
          </span>

        </div>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="leave-details-header">

          <div className="leave-details-header-content">

            <h1>
              Leave Details
            </h1>

            <p>
              Complete information about the leave request,
              application details and approval status.
            </p>

          </div>


          <div className="leave-details-header-status">

            <span className="leave-id-badge">
              Leave ID:{" "}
              {leaveRequest?.id || "ID Number"}
            </span>

            <span className="approved-badge">
  <img
    src={approvedIcon}
    alt=""
    aria-hidden="true"
    className="approved-badge-icon"
  />
  <span>{status}</span>
</span>

          </div>

          

        </div>


        {/* =====================================================
            EMPLOYEE INFORMATION
        ===================================================== */}

        <div className="leave-details-employee">


          <div className="leave-details-profile">

            <div className="leave-details-avatar">
              <span>👤</span>
            </div>


            <div className="leave-details-employee-name">

              <h2>
                {employeeName}
              </h2>

              <p>
                ID - {employeeCode}
              </p>

              <span>
                {designationName}
              </span>

            </div>

          </div>


          <div className="leave-details-employee-info">

            <div>

              <small>
                Department
              </small>

              <strong>
                {departmentName}
              </strong>

            </div>


            <div>

              <small>
                Designation
              </small>

              <strong>
                {designationName}
              </strong>

            </div>


            <div>

              <small>
                Reporting Manager
              </small>

              <strong>
                {reportingManagerName}
              </strong>

            </div>


            <div>

              <small>
                Date of Joining
              </small>

              <strong>
                {
                  employeeProfile?.date_of_joining
                    ? formatDateValue(
                        employeeProfile.date_of_joining
                      )
                    : "12 Jun 2026"
                }
              </strong>

            </div>

          </div>

        </div>


        {/* =====================================================
            LOADING / ERROR
        ===================================================== */}

        {loading ? (

          <div style={{ padding: "20px 0" }}>
            Loading leave details...
          </div>

        ) : error ? (

          <div
            style={{
              padding: "20px 0",
              color: "#d93025",
            }}
          >
            {error}
          </div>

        ) : !leaveRequest ? (

          <div style={{ padding: "20px 0" }}>
            No leave request found.
          </div>

        ) : (


          <div className="leave-details-content">


            {/* =================================================
                LEAVE INFORMATION
            ================================================= */}

            <section className="leave-details-card">

              <div className="leave-details-card-header">

                <img
                  src={dateRangeIcon}
                  alt="Date Range"
                  className="leave-details-card-icon"
                />

                <h3>
                  Leave information
                </h3>


                <button
  type="button"
  className="edit-request-button"
>
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 20H8L19.5 8.5C20.3284 7.67157 20.3284 6.32843 19.5 5.5C18.6716 4.67157 17.3284 4.67157 16.5 5.5L5 17V20Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M14.5 7.5L17.5 10.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  <span>Edit Request</span>
</button>

              </div>


              <div className="leave-info-list">


                <div className="leave-info-row">

                  <span>
                    Leave Type
                  </span>

                  <strong className="leave-type-blue">
                    {leaveType}
                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    From Date
                  </span>

                  <strong>
                    {fromDate} (Wed)
                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    To Date
                  </span>

                  <strong>
                    {toDate} (Thu)
                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    Duration
                  </span>

                  <strong>
                    {duration}
                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    Reason
                  </span>

                  <strong className="leave-reason">
                    {reason}
                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    Status
                  </span>

                  {renderStatusBadge(
                    Boolean(status),
                    status
                  )}

                </div>

              </div>

            </section>



            {/* =================================================
                APPLY LEAVE DETAILS
            ================================================= */}

            <section className="leave-details-card apply-leave-details-card">


              <div className="leave-details-card-header">

                <img
                  src={documentIcon}
                  alt="Document"
                  className="leave-details-card-icon"
                />

                <h3>
                  Apply Leave Details
                </h3>

              </div>


              <div className="leave-info-list">


                <div className="leave-info-row">

                  <span>
                    Applied On
                  </span>

                  <strong>
                    {appliedOn}
                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    Applied Via
                  </span>

                  <strong>
                    Employee Portal (web)
                  </strong>

                </div>


                {contactNumber ? (

                  <div className="leave-info-row">

                    <span>
                      Contact During Leave
                    </span>

                    <strong>
                      {contactNumber}
                    </strong>

                  </div>

                ) : null}


                <div className="leave-info-row">

                  <span>
                    Work Handover
                  </span>


                  <strong className="leave-approved-small">

                    {hasHandover ? (

                      <>

                        <img
                          src={approvedIcon}
                          alt=""
                          aria-hidden="true"
                        />

                        <span>
                          Completed
                        </span>

                      </>

                    ) : (

                      <span>
                        Completed
                      </span>

                    )}

                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    Handover TO
                  </span>

                  <strong>

                    {
                      hasHandover
                        ? `${handoverName} (ID - ${handoverCode})`
                        : "Employee name (ID - 001010)"
                    }

                  </strong>

                </div>


                <div className="leave-info-row">

                  <span>
                    Remark
                  </span>

                  <strong className="apply-leave-remark">

                    {
                      leaveRequest?.remark ||
                      "I will be available on phone for urgent discussions."
                    }

                  </strong>

                </div>

              </div>

            </section>



            {/* =================================================
                APPROVAL STATUS
            ================================================= */}

            <section className="leave-details-card leave-approval-card">


              <div className="leave-details-card-header">

                <img
                  src={peopleIcon}
                  alt="People"
                  className="leave-details-card-icon"
                />

                <h3>
                  Approval Status
                </h3>


                <span className="approval-header-text">

                  <img
                    src={approvedIcon}
                    alt=""
                    aria-hidden="true"
                    className="approval-header-check"
                  />

                  <span>
                    {approvalStatusText}
                  </span>

                </span>

              </div>


              <div className="approval-timeline">


                {/* =========================
                    LEAVE APPLIED
                ========================= */}
<div className="approval-item">

  <div className="approval-line">

    <span className="approval-circle">
      <span className="approval-check">✓</span>
    </span>

  </div>



                  <div className="approval-content">

                    <h4>
                      Leave Applied
                    </h4>

                    <p>
                      15 Sep 2026, 10:31 AM
                    </p>

                    <span>
                      Leave request submitted by Arun Kumar.
                    </span>

                  </div>


                  <div className="approval-person">

                    <div className="approval-person-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        Arun Kumar
                      </strong>

                      <span>
                        Employee
                      </span>

                    </div>

                  </div>

                </div>



                {/* =========================
                    REVIEWED BY MANAGER
                ========================= */}

                <div className="approval-item">

                  <div className="approval-line">

    <span className="approval-circle">
      <span className="approval-check">✓</span>
    </span>

  </div>



                  <div className="approval-content">

                    <h4>
                      Reviewed by Manager
                    </h4>

                    <p>
                      15 Sep 2026, 10:31 AM
                    </p>

                    <span>
                      Reviewed by Sriram Sir
                    </span>

                  </div>


                  <div className="approval-person">

                    <div className="approval-person-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        Sriram
                      </strong>

                      <span>
                        CEO
                      </span>

                    </div>

                  </div>

                </div>



                {/* =========================
                    APPROVED
                ========================= */}

                <div className="approval-item">

                  <div className="approval-line">

    <span className="approval-circle">
      <span className="approval-check">✓</span>
    </span>

  </div>


                  <div className="approval-content">

                    <h4>
                      Approved
                    </h4>

                    <p>
                      15 Sep 2026, 10:31 AM
                    </p>

                    <span>
                      Approved by Sriram Sir
                    </span>

                  </div>


                  <div className="approval-person">

                    <div className="approval-person-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        Sriram
                      </strong>

                      <span>
                        CEO
                      </span>

                    </div>

                  </div>

                </div>



                {/* =========================
                    HR VERIFICATION
                ========================= */}

                <div className="approval-item">

                  <div className="approval-line">

    <span className="approval-circle">
      <span className="approval-check">✓</span>
    </span>

  </div>


                  <div className="approval-content">

                    <h4>
                      HR Verification
                    </h4>

                    <p>
                      15 Sep 2026, 10:45 AM
                    </p>

                    <span>
                      Leave request verified by HR Department.
                    </span>

                  </div>


                  <div className="approval-person">

                    <div className="approval-person-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        Ruthrasri
                      </strong>

                      <span>
                        HR
                      </span>

                    </div>

                  </div>

                </div>


              </div>

            </section>



            {/* =================================================
                LEAVE BALANCE
            ================================================= */}

            <section className="leave-details-card leave-balance-card">


              <div className="leave-details-card-header leave-balance-header">

                <span className="leave-balance-icon">

                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="#1B70F5"
                    />

                    <path
                      d="M12 2V12H22"
                      fill="#C6E8FA"
                    />

                  </svg>

                </span>


                <h3>
                  Leave Balance
                </h3>


                <span className="leave-balance-date">
                  (as of 17 Sep 2026)
                </span>

              </div>


              <div className="leave-balance-content">


                {balanceEntries.map((item, index) => {

                  const label =
                    item.leave_type_name ||
                    item.name;

                  const total =
                    Number(item.total_days ?? 12);

                  const remaining =
                    Number(
                      item.remaining_days ??
                      item.remaining ??
                      8
                    );

                  const used =
                    total - remaining;

                  const progress =
                    total > 0
                      ? Math.min(
                          (used / total) * 100,
                          100
                        )
                      : 0;


                  return (

                    <div
                      key={`${label}-${index}`}
                      className="leave-balance-row"
                    >

                      <div className="leave-balance-row-top">

                        <span>
                          {label}
                        </span>

                        <strong>
                          {remaining} / {total} Days
                        </strong>

                      </div>


                      <div className="leave-balance-progress">

                        <div
                          className="leave-balance-progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                })}

              </div>

            </section>



            {/* =================================================
                ATTACHMENTS
            ================================================= */}

            <section className="leave-details-attachment-card">


              <div className="attachment-header">

                <img
                  src={attachmentIcon}
                  alt="Attachment"
                  className="attachment-header-icon"
                />

                <h3>
                  Attachment
                </h3>

              </div>


              <div className="attachment-list">


                {attachments.map((file, index) => (

                  <div
                    className="attachment-file-card"
                    key={`att-${index}`}
                  >


                    {/* PDF / FILE ICON */}

                    <div className="attachment-pdf-icon">

                      <img
                        src={fileIcon}
                        alt="File"
                      />

                    </div>


                    <div className="attachment-file-info">

                      <div className="attachment-file-name">
                        {file.name}
                      </div>

                      <div className="attachment-file-meta">
                        {file.size} | {file.date}
                      </div>

                    </div>


                    {/* DOWNLOAD ICON ONLY CHANGED */}

                    <a
                      href="#"
                      className="attachment-download-button"
                      aria-label={`Download ${file.name}`}
                    >

                      <img
                        src={downloadSymbol}
                        alt="Download"
                        className="attachment-download-icon"
                      />

                    </a>


                  </div>

                ))}


              </div>

            </section>



            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="leave-details-actions">


              <button
                type="button"
                className="download-leave-button"
              >

                <img
                  src={leaveDownloadIcon}
                  alt=""
                  aria-hidden="true"
                />

                <span>
                  Download Leave Details
                </span>

              </button>


             <button
  type="button"
  className="cancel-leave-button"
>
  <img
    src={deleteIcon}
    alt=""
    aria-hidden="true"
  />

  <span>
    Cancel Leave
  </span>
</button>


            </div>


          </div>

        )}

      </div>

    </Layout>

  );
};


export default LeaveDetails;
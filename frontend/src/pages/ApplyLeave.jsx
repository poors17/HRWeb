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
import calendarIcon from "../assets/dashboard/vector.svg";


const ApplyLeave = () => {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] =
    React.useState("Casual Leave");

const [fromDate, setFromDate] =
  React.useState("2026-11-18");

const [toDate, setToDate] =
  React.useState("2026-11-19");

const calculateDuration = (from, to) => {
  if (!from || !to) return 0;

  const fromDateObject = new Date(`${from}T00:00:00`);
  const toDateObject = new Date(`${to}T00:00:00`);

  const difference =
    toDateObject.getTime() - fromDateObject.getTime();

  const days =
    Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

  return days > 0 ? days : 0;
};
const duration = calculateDuration(fromDate, toDate);

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

  const [reason, setReason] =
    React.useState("");

  const [handover, setHandover] =
    React.useState("Demo name (ID - 001010)");

// ============================================================
// SUBMIT LEAVE
// ============================================================

const handleSubmitLeave = () => {
  navigate("/leave-submitted", {
    state: {
      leaveType: leaveType,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      duration: `${duration} ${duration === 1 ? "Day" : "Days"}`,
      appliedOn: "17 Sep 2026, 10:32 AM",
      status: "Pending Approval",
    },
  });
};

  return (
    <Layout>

      <div className="apply-leave-page">

        {/* =====================================================
            PAGE HEADING
        ====================================================== */}

     <section className="apply-leave-heading">

  {/* =====================================================
      BREADCRUMB
  ====================================================== */}

  <div className="apply-leave-breadcrumb">

    <button
      type="button"
      className="apply-leave-breadcrumb-back"
      onClick={() =>
        navigate("/employee-dashboard")
      }
      aria-label="Go back"
    >
      <ArrowLeft
        size={24}
        strokeWidth={2}
      />
    </button>


    <button
      type="button"
      className="apply-leave-breadcrumb-parent"
      onClick={() =>
        navigate("/employee-dashboard")
      }
    >
      Leave Management
    </button>


    <span className="apply-leave-breadcrumb-separator">
      &gt;
    </span>


    <span className="apply-leave-breadcrumb-current">
      Apply Leave
    </span>

  </div>


  {/* =====================================================
      PAGE TITLE
  ====================================================== */}

  <div className="apply-leave-title">

    <h1>
      Apply for Leave
    </h1>


    <p>
      Fill in the details below to submit your leave request.
    </p>

  </div>

</section>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <section className="apply-leave-grid">


          {/* ===================================================
              LEFT - LEAVE FORM
          ==================================================== */}

          <div className="apply-leave-form-card">


            {/* LEAVE TYPE */}

            <div className="apply-leave-form-row">

              <label>
                Leave Type <span>*</span>
              </label>


              <div className="apply-leave-select-wrapper">

                <select
                  value={leaveType}
                  onChange={(event) =>
                    setLeaveType(event.target.value)
                  }
                >

                  <option>
                    Casual Leave
                  </option>

                  <option>
                    Sick Leave
                  </option>

                  <option>
                    Annual Leave
                  </option>

                  <option>
                    Compensatory Leave
                  </option>

                </select>


               <ChevronDown
  className="apply-leave-select-arrow"
  size={18}
  strokeWidth={2.5}
/>

              </div>

            </div>


            {/* FROM DATE */}

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
    onChange={(event) =>
      setFromDate(event.target.value)
    }
    className="apply-leave-native-date"
  />

  <img
    src={calendarIcon}
    alt="Calendar"
    className="apply-leave-calendar-icon"
  />

</div>

            </div>


            {/* TO DATE */}

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
    onChange={(event) =>
      setToDate(event.target.value)
    }
    className="apply-leave-native-date"
  />

  <img
    src={calendarIcon}
    alt="Calendar"
    className="apply-leave-calendar-icon"
  />

</div>

            </div>


            {/* DURATION */}

            <div className="apply-leave-form-row">

              <label>
                Duration
              </label>


          <div className="apply-leave-duration">
  {calculateDuration(fromDate, toDate)}{" "}
  {calculateDuration(fromDate, toDate) === 1 ? "Day" : "Days"}
</div>

            </div>


            {/* REASON */}

            <div
              className="
                apply-leave-form-row
                apply-leave-reason-row
              "
            >

              <label>
                Reason <span>*</span>
              </label>


              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="reason of leave"
              />

            </div>

          </div>


          {/* ===================================================
              RIGHT COLUMN
          ==================================================== */}

          <div className="apply-leave-right-column">


            {/* =================================================
                LEAVE BALANCE
            ================================================== */}

            <div className="apply-leave-balance-card">

              <div className="apply-leave-balance-header">
                Leave Balance
              </div>


              <div className="apply-leave-balance-content">


                {/* CASUAL */}

                <div className="apply-leave-balance-row">

                  <span>
                    Casual Leave
                  </span>

                  <strong>
                    8 <small>/ 12 days</small>
                  </strong>

                </div>


                {/* SICK */}

                <div className="apply-leave-balance-row">

                  <span>
                    Sick Leave
                  </span>

                  <strong>
                    6 <small>/ 10 days</small>
                  </strong>

                </div>


                {/* ANNUAL */}

                <div className="apply-leave-balance-row">

                  <span>
                    Annual Leave
                  </span>

                  <strong>
                    14 <small>/ 20 days</small>
                  </strong>

                </div>


                {/* COMPENSATORY */}

                <div className="apply-leave-balance-row">

                  <span>
                    Compensatory leave
                  </span>

                  <strong>
                    2 <small>/ 5 days</small>
                  </strong>

                </div>

              </div>

            </div>


            {/* =================================================
                WORK HANDOVER
            ================================================== */}

            <div className="apply-leave-handover">

              <label>
                Work Handover To
              </label>


              <div className="apply-leave-handover-select">

                <select
                  value={handover}
                  onChange={(event) =>
                    setHandover(event.target.value)
                  }
                >

                  <option>
                    Demo name (ID - 001010)
                  </option>

                  <option>
                    Employee 2 (ID - 001011)
                  </option>

                  <option>
                    Employee 3 (ID - 001012)
                  </option>

                </select>


               <ChevronDown
  size={18}
  strokeWidth={2.5}
  className="apply-leave-handover-arrow"
/>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CONTACT DURING LEAVE
        ====================================================== */}

        <section className="apply-leave-contact">

          <label>
            Contact During Leave
          </label>


          <div className="apply-leave-contact-input">
<Phone
  size={21}
  strokeWidth={2}
  color="#66696B"
/>

            <input
              type="text"
              value="+91 98777 77777"
              readOnly
            />

          </div>

        </section>


        {/* =====================================================
            BOTTOM ACTIONS
        ====================================================== */}

        <section className="apply-leave-actions">

          <button
            type="button"
            className="apply-leave-cancel"
            onClick={() =>
              navigate("/employee-dashboard")
            }
          >
            Cancel
          </button>


          <button
  type="button"
  className="apply-leave-submit"
  onClick={handleSubmitLeave}
>

  <Download
    size={22}
    strokeWidth={2.5}
  />

  <span>
    Submit Leave
  </span>

</button>

        </section>

      </div>

    </Layout>
  );
};


export default ApplyLeave;
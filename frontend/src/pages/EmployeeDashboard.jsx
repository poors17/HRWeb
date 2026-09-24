import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  ArrowRight,
  Upload,
  Star
} from "lucide-react";

import Layout from "../styles/Layout";
import "./EmployeeDashboard.css"; // UNGA CSS FILE ITHU

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// ============================================================
// ICONS
// ============================================================
import calenderIcon from "../assets/cards/calender.png";
import leaveIcon from "../assets/dashboard/Vector.svg";
import payslipIcon from "../assets/dashboard/pay-svg.svg";
import goalsIcon from "../assets/dashboard/target-marketing.svg";
import dateRangeIcon from "../assets/cards/date-range.svg";
import locationIcon from "../assets/cards/location.svg";
import loginIcon from "../assets/cards/login.svg";
import clockIcon from "../assets/cards/clock.svg";

// ============================================================
// COMPONENT
// ============================================================

const EmployeeDashboard = ({ employee = null }) => {
  const navigate = useNavigate();
  
  // States
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveBalanceLoading, setLeaveBalanceLoading] = useState(true);
  
  const [payslipData, setPayslipData] = useState(null);
  const [goalsData, setGoalsData] = useState(null);

  // ==========================================================
  // 1. LOAD LEAVE BALANCES (DEFAULT API COMMENTED)
  // ==========================================================
  const loadLeaveBalances = useCallback(async () => {
    try {
      setLeaveBalanceLoading(true);

      /* =========================================================
         ORIGINAL BACKEND API CODE - COMMENTED FOR FRONTEND WORK
      ========================================================= 
      const response = await fetch(`${API_URL}/api/leave/balance?year=${new Date().getFullYear()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      
      const mappedBalances = Array.isArray(data) ? data.map(...) : [];
      setLeaveBalances(mappedBalances);
      ========================================================= */

      // DUMMY DATA FOR UI
      const dummyBalances = [
        { id: 1, name: "Casual", totalDays: 10, usedDays: 4, remaining: 6 },
        { id: 2, name: "Sick", totalDays: 10, usedDays: 6, remaining: 4 },
        { id: 3, name: "Earned", totalDays: 10, usedDays: 8, remaining: 2 }
      ];
      
      setTimeout(() => {
        setLeaveBalances(dummyBalances);
        setLeaveBalanceLoading(false);
      }, 500);

    } catch (error) {
      setLeaveBalances([]);
      setLeaveBalanceLoading(false);
    }
  }, []);

  // ==========================================================
  // 2. LOAD PAYSLIP DATA (WAITING FOR BACKEND)
  // ==========================================================
  const loadPayslipData = useCallback(() => {
    // DUMMY DATA FOR FRONTEND UI
    setPayslipData({
      month: "August 2026",
      status: "Net Salary Credited",
      alerts: [
        { title: "payslip available", desc: "Download your latest payslip.", date: null },
        { title: "payslip available", desc: null, date: "21 sep 2026" }
      ]
    });
  }, []);

  // ==========================================================
  // 3. LOAD GOALS DATA (WAITING FOR BACKEND)
  // ==========================================================
  const loadGoalsData = useCallback(() => {
    // DUMMY DATA FOR FRONTEND UI
    setGoalsData({
      completed: 4,
      total: 6,
      percentage: 67,
      trackMessage: "You're on track!",
      subMessage: "keep up the great work"
    });
  }, []);

  useEffect(() => {
    loadLeaveBalances();
    loadPayslipData();
    loadGoalsData();
  }, [loadLeaveBalances, loadPayslipData, loadGoalsData]);

  // Calculations & Formatting
  const totalRemainingDays = leaveBalances.reduce((sum, item) => sum + Number(item.remaining ?? 0), 0);
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = (localStorage.getItem("name") || "Name").trim().split(/\s+/)[0];
  const todayDay = today.toLocaleDateString("en-GB", { weekday: "long" });
  const todayDate = today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const attendanceData = {
    name: employee?.name || "Employee Name",
    employeeId: employee?.employeeId || "1024",
    department: employee?.department || "Department",
    date: employee?.date || "Thurs, 12 Sep 2026",
    today: employee?.today || "Today",
    status: employee?.status || "Present",
    checkIn: employee?.checkIn || "09:02 AM",
    checkInStatus: employee?.checkInStatus || "On Time",
    checkOut: employee?.checkOut || "06:02 PM",
    checkOutStatus: employee?.checkOutStatus || "On Time",
    workingHours: employee?.workingHours || "8h 25m",
    progress: employee?.progress ?? 100,
    completedHours: employee?.completedHours || "8h 02m",
    requiredHours: employee?.requiredHours || "8h 00m",
    shiftTime: employee?.shiftTime || "09:00 AM - 06:00 PM",
    shiftName: employee?.shiftName || "General shift",
    profileImage: employee?.profileImage || null,
  };

  const getStatusClass = (status) => (status?.toLowerCase() === "present" ? "present" : "absent");

  return (
    <Layout>
      <div className="employee-dashboard-content">
        
        {/* WELCOME SECTION */}
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <div className="welcome-small">{greeting},</div>
            <div className="welcome-title">{firstName}! <span className="welcome-hand">👋</span></div>
            <div className="welcome-description">Here’s your overview for today. keep going!</div>
            <div className="welcome-quote">
              <span className="quote-line"></span>
              <span>“progress happens when consistency meets purpose.”</span>
            </div>
          </div>
          <div className="dashboard-date">
            <img src={calenderIcon} alt="Calendar" className="dashboard-calendar-icon" />
            <div className="dashboard-date-content">
              <span className="dashboard-day">{todayDay}</span>
              <strong>{todayDate}</strong>
              <span className="date-gradient-line"></span>
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="dashboard-actions">
          <button type="button" className="dashboard-action edit-widget">Edit widget</button>
          <button type="button" className="dashboard-action manage-dashboard">Manage Dashboard</button>
          <button type="button" className="dashboard-action export-dashboard">
            <Upload size={15} strokeWidth={2.5} />
            <span>Export</span>
          </button>
        </div>

        {/* CARDS SECTION */}
        <section className="dashboard-cards">
          
          {/* 1. ATTENDANCE CARD */}
          <div className="figma-attendance-card">
            <div className="attendance-card-title">
              <h2>Attendance</h2>
              <div className="attendance-status">
                <span className={`status-dot ${getStatusClass(attendanceData.status)}`}></span>
                <span>{attendanceData.status}</span>
              </div>
            </div>

            <div className="attendance-employee">
              <div className="attendance-profile">
                {attendanceData.profileImage ? (
                  <img src={attendanceData.profileImage} alt="Employee" />
                ) : (
                  <CircleUserRound size={42} strokeWidth={1.8} />
                )}
              </div>
              <div className="attendance-employee-details">
                <strong>{attendanceData.name}</strong>
                <span># {attendanceData.employeeId}</span>
                <small>{attendanceData.department}</small>
              </div>
              <div className="attendance-info-divider"></div>
              <div className="attendance-date">
                <img src={dateRangeIcon} alt="Date" className="attendance-date-icon" />
                <div>
                  <strong>{attendanceData.date}</strong>
                  <span>{attendanceData.today}</span>
                </div>
              </div>
            </div>

            <div className="attendance-check-row">
              <div className="check-box">
                <div className="check-icon check-in-icon">
                  <img src={loginIcon} alt="Check In" />
                </div>
                <div className="check-content">
                  <span>Check In</span>
                  <strong>{attendanceData.checkIn}</strong>
                  <small className="on-time">{attendanceData.checkInStatus}</small>
                </div>
              </div>
              <div className="check-box">
                <div className="check-icon check-out-icon">
                  <img src={loginIcon} alt="Check Out" />
                </div>
                <div className="check-content">
                  <span>Check Out</span>
                  <strong>{attendanceData.checkOut}</strong>
                  <small className="on-time">{attendanceData.checkOutStatus}</small>
                </div>
              </div>
            </div>

            <div className="working-hours">
              <div className="working-hours-icon">
                <img src={clockIcon} alt="Working Hours" />
              </div>
              <div className="working-hours-content">
                <span>Working Hours</span>
                <strong>{attendanceData.workingHours}</strong>
                <div className="progress-row">
                  <div className="progress-bar">
                    <div className="progress-fill progress-green" style={{ width: `${attendanceData.progress}%` }}></div>
                  </div>
                  <b>{attendanceData.progress}%</b>
                </div>
                <small>{attendanceData.completedHours} / {attendanceData.requiredHours}</small>
              </div>
            </div>

            <div className="shift-timing">
              <div className="shift-icon">
                <img src={dateRangeIcon} alt="Shift Timing" />
              </div>
              <div className="shift-content">
                <span>Shift Timing</span>
                <strong>{attendanceData.shiftTime}</strong>
                <small>{attendanceData.shiftName}</small>
              </div>
            </div>

            <button type="button" className="attendance-view-details" onClick={() => navigate("/attendance")}>
              <span>View Details</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* 2. LEAVE BALANCE CARD */}
          <div className="leave-balance-card">
            <div className="leave-card-header">
              <div className="leave-card-icon">
                <img src={leaveIcon} alt="Leave" />
              </div>
              <h2 className="leave-card-title">Leave Balance</h2>
            </div>
            
            <div className="leave-apply-section">
              <button type="button" className="apply-leave-button" onClick={() => navigate("/apply-leave")}>Apply Leave</button>
            </div>

            <div className="leave-remaining-section">
              <div className="leave-remaining-days">
                {leaveBalanceLoading ? "..." : `${totalRemainingDays} Days`}
              </div>
              <div className="leave-remaining-label">Remaining</div>
            </div>

            <div className="leave-level-section">
              {!leaveBalanceLoading && leaveBalances.map((entry, index) => {
                const width = entry.totalDays > 0 ? (entry.remaining / entry.totalDays) * 100 : 0;
                const variantClass = ["variant-green", "variant-blue", "variant-cyan"][index % 3];
                return (
                  <div className="leave-balance-row" key={entry.id}>
                    <span className="leave-balance-label">{entry.name}</span>
                    <div className="leave-progress-wrapper">
                      <div className="leave-progress-track">
                        <div className={`leave-progress-fill ${variantClass}`} style={{ width: `${width}%` }} />
                      </div>
                      <span className="leave-balance-value">{entry.remaining} / {entry.totalDays}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="leave-card-footer">
              <button type="button" className="view-leave-button" onClick={() => navigate("/leave-details")}>
                <span>View Leave</span>
                <ArrowRight size={28} strokeWidth={1.7} />
              </button>
            </div>
          </div>

          {/* ==================================================
              3. NEW LEAVE PAYSLIP CARD (Using inline styles to avoid touching CSS file)
          =================================================== */}
          {payslipData && (
            <div className="leave-balance-card" style={{ backgroundColor: '#eefcf5' }}>
              
              <div className="leave-card-header" style={{ backgroundColor: 'transparent' }}>
                <div className="leave-card-icon" style={{ backgroundColor: '#d1f4e1' }}>
                  <img src={payslipIcon} alt="Payslip" style={{ filter: 'none' }} />
                </div>
                <h2 className="leave-card-title">Leave Payslip</h2>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', margin: '0 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0d3c61' }}>{payslipData.month}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#666' }}>{payslipData.status}</p>

                {payslipData.alerts.map((alert, idx) => (
                  <div key={idx} style={{ backgroundColor: '#e6f3fa', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                    <img src={calenderIcon} alt="alert" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ fontSize: '13px', color: '#0d3c61' }}>{alert.title}</strong>
                      {alert.desc && <span style={{ fontSize: '11px', color: '#666' }}>{alert.desc}</span>}
                      {alert.date && <span style={{ fontSize: '11px', color: '#666' }}>{alert.date}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="leave-card-footer" style={{ borderTop: 'none', backgroundColor: 'transparent', paddingBottom: '0' }}>
                <button type="button" className="view-leave-button" style={{ color: '#2eab74' }}>
                  <span>View Leave</span>
                  <ArrowRight size={28} strokeWidth={1.7} />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              4. NEW GOALS CARD (Using inline styles to avoid touching CSS file)
          =================================================== */}
          {goalsData && (
            <div className="leave-balance-card" style={{ backgroundColor: '#eef3f9' }}>
              
              <div className="leave-card-header" style={{ backgroundColor: 'transparent' }}>
                <div className="leave-card-icon" style={{ backgroundColor: 'transparent' }}>
                  <img src={goalsIcon} alt="Goals" style={{ filter: 'none', width: '28px', height: '28px' }} />
                </div>
                <h2 className="leave-card-title">Goals</h2>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', margin: '0 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '42px', color: '#000', margin: '0 0 16px 0' }}>{goalsData.completed}/{goalsData.total}</h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                  <span>Goals Completed</span>
                  <span>{goalsData.percentage}%</span>
                </div>
                
                <div style={{ backgroundColor: '#e0e0e0', height: '8px', borderRadius: '10px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: '#2eab74', height: '100%', borderRadius: '10px', width: `${goalsData.percentage}%` }}></div>
                </div>

                <div style={{ backgroundColor: '#eefcf5', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Star size={20} color="#2eab74" fill="#2eab74" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '14px', color: '#2eab74', marginBottom: '4px' }}>{goalsData.trackMessage}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>{goalsData.subMessage}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </section>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
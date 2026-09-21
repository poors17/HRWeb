import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login1 from "./pages/Login1";

import ProtectedRoute, {
  PublicRoute,
} from "./pages/ProtectedRoute";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import AttendanceDetails from "./pages/AttendanceDetails";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveSubmitted from "./pages/LeaveSubmitted";
import LeaveDetails from "./pages/LeaveDetails";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
            LOGIN / PUBLIC ROUTES
            ===================================================== */}

        <Route element={<PublicRoute />}>

          {/* Login */}
          <Route
            path="/login"
            element={<Login1 />}
          />

          {/* Default URL */}
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Route>


        {/* =====================================================
            PROTECTED APPLICATION ROUTES
            ===================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* Employee Dashboard */}
          <Route
            path="/dashboard"
            element={<EmployeeDashboard />}
          />

          {/* Employee Dashboard - Alternate Route */}
          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard />}
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={<AttendanceDetails />}
          />

          {/* Apply Leave */}
          <Route
            path="/apply-leave"
            element={<ApplyLeave />}
          />

          {/* Leave Request Submitted */}
          <Route
            path="/leave-submitted"
            element={<LeaveSubmitted />}
          />

          {/* Leave Details */}
          <Route
            path="/leave-details"
            element={<LeaveDetails />}
          />

        </Route>


        {/* =====================================================
            UNKNOWN URL
            ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;
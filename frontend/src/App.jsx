import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login1 from "./pages/Login1";
import ProtectedRoute, { PublicRoute } from "./pages/ProtectedRoute";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AttendanceDetails from "./pages/AttendanceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login1 />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* PROTECTED APPLICATION */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<EmployeeDashboard />}
          />

          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard />}
          />

          <Route
            path="/attendance"
            element={<AttendanceDetails />}
          />
        </Route>

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
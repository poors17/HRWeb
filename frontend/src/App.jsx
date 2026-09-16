import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import EmployeeDashboard
  from "./pages/EmployeeDashboard";

import AttendanceDetails
  from "./pages/AttendanceDetails";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/employee-dashboard"
          element={
            <EmployeeDashboard />
          }
        />

        <Route
          path="/attendance"
          element={
            <AttendanceDetails />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/employee-dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
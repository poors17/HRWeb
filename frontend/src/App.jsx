import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login1 from "./Components/Login1";
import Dashboard from "./Components/Dashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login1 />} />

        {/* Existing Dashboard - DO NOT CHANGE */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Employee Dashboard */}
        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
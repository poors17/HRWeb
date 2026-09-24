import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// LocalStorage-la irunthu login status-ah check panra function
const checkAuth = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

function ProtectedRoute() {
  return checkAuth() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export function PublicRoute() {
  return checkAuth() ? (
    <Navigate to="/employee-dashboard" replace />
  ) : (
    <Outlet />
  );
}

export default ProtectedRoute;
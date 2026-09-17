import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function ProtectedRoute() {
  return isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export function PublicRoute() {
  return isLoggedIn() ? (
    <Navigate to="/employee-dashboard" replace />
  ) : (
    <Outlet />
  );
}

export default ProtectedRoute;
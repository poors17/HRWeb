import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// ==========================================
// CHECK FRONTEND LOGIN
// ==========================================

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute() {
  return isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

// ==========================================
// PUBLIC ROUTE
// ==========================================

export function PublicRoute() {
  return isLoggedIn() ? (
    <Navigate to="/employee-dashboard" replace />
  ) : (
    <Outlet />
  );
}

export default ProtectedRoute;
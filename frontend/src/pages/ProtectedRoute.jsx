import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function hasValidToken() {
      const token = localStorage.getItem("token");
      if (!token) return false;

      try {
            const encodedPayload = token.split(".")[1]
                  .replace(/-/g, "+")
                  .replace(/_/g, "/");
            const payload = JSON.parse(atob(encodedPayload));
            return !payload.exp || payload.exp * 1000 > Date.now();
      } catch {
            return false;
      }
}

function ProtectedRoute() {
      return hasValidToken() ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicRoute() {
      return hasValidToken() ? (
            <Navigate to="/employee-dashboard" replace />
      ) : (
            <Outlet />
      );
}

export default ProtectedRoute;
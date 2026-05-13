import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, rolPermitido = [] }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (rolPermitido.length > 0 && !rolPermitido.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

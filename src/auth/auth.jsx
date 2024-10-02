import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ requiredRole = null }) => {
  const { role, isLoggedIn } = useSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;

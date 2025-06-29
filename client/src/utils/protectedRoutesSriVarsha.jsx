import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);
  const loader = useSelector((state) => state?.auth?.loader);

  // If still loading, do not render or redirect; show a loader instead
  if (loader) {
    return <h1>Loading...</h1>;
  }

  // If authenticated and has the correct role, render the requested component
  if (isLoggedIn && allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // If authenticated but lacks the correct role, redirect to /denied
  if (isLoggedIn) {
    return <Navigate to="/denied" />;
  }

  // If not authenticated, redirect to /login
  return <Navigate to="/login" />;
};

export default RequireAuth;
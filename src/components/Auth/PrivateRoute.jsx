import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/Login" />;
  }

  if (!currentUser.emailVerified) {
    // If the user is logged in but email is not verified,
    // redirect to a new "EmailVerificationRequired" page
    return <Navigate to="/email-verification-required" />;
  }

  return children;
};

export default PrivateRoute;

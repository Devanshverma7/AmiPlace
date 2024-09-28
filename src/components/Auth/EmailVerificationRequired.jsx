import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  sendEmailVerification,
  deleteUser,
  signOut,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";

const EmailVerificationRequired = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email. Please try again later.");
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        // Attempt to delete the user
        await deleteUser(currentUser);
        alert(
          "Your account has been deleted. You can now sign up with a new email."
        );
        navigate("/SignUpPage");
      } catch (error) {
        console.error("Error deleting user:", error);
        if (error.code === "auth/requires-recent-login") {
          // If recent authentication is required, sign out the user
          await signOut(auth);
          alert(
            "For security reasons, please log in again to delete your account."
          );
          navigate("/Login");
        } else {
          alert("Failed to delete user. Please try again later.");
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please verify your email address to access your account.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-sm text-gray-500">
            We've sent a verification email to your registered email address.
            Please check your inbox and click on the verification link.
          </p>
          <button
            onClick={handleResendVerification}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Resend Verification Email
          </button>
          <button
            onClick={handleDeleteUser}
            disabled={isDeleting}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isDeleting ? "Deleting..." : "Delete Account and Change Email"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already verified?{" "}
            <Link
              to="/Login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationRequired;

import React from 'react';
import { Link } from 'react-router-dom';

function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification email to your address. Please check your inbox and click the verification link.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-sm text-gray-500">
            After verifying your email, you can proceed to log in.
          </p>
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
// src/components/PasswordResetForm.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../api.jsx";

const PasswordResetEmail = ({ onCancel }) => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const params = useParams();

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleResetPasswordEmail = async (e) => {
    e.preventDefault();

    try {
      await resetPassword(resetEmail, params.token); // Pass the token from URL params
      setResetError("");
      setResetSuccess(true);
    } catch (error) {
      setResetError(
        error.message || "Failed to reset password. Please try again."
      );
      setResetSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
          Reset Password
        </h2>
        {!resetSuccess ? (
          <>
            <form onSubmit={handleResetPasswordEmail}>
              <div className="mb-4">
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email Address:
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  name="resetEmail"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-600"
                />
              </div>
              {resetError && <p className="text-red-500 mt-1">{resetError}</p>}
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Send Email
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-green-600 mt-2">
            Password reset instructions sent to your email.
          </p>
        )}
        <button
          className="mt-4 w-full bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 focus:outline-none"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PasswordResetEmail;

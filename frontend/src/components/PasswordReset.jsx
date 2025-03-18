// src/components/PasswordReset.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordEmail, resetPasswordProfile } from "../api.jsx"; // Import resetPasswordToken function
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const PasswordReset = ({ isEmailLink }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        navigate("/login"); // Navigate to login page after successful password reset
      }, 2000); // Delay the navigation by 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isNavigating, navigate]);

  const togglePasswordVisibility = (field) => {
    if (field === "newPassword") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    } else if (field === "currentPassword") {
      setShowCurrentPassword(!showCurrentPassword);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const handleCurrentPasswordChange = (e) => {
    const currentPasswordValue = e.target.value;
    setCurrentPassword(currentPasswordValue);
    setCurrentPasswordError(validatePassword(currentPasswordValue));
  };

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    setNewPasswordError(validatePassword(newPasswordValue));
    if (confirmPassword && confirmPassword !== newPasswordValue) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    setConfirmPasswordError(
      confirmPasswordValue !== newPassword ? "Passwords do not match" : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmailLink) {
      if (
        newPasswordError ||
        confirmPasswordError ||
        newPassword !== confirmPassword
      ) {
        return;
      }

      setLoading(true);

      try {
        // Call resetPassword function to reset the password via POST request
        await resetPasswordEmail(token, newPassword);
        setSuccess(true);
        setError("");
        setIsNavigating(true);
      } catch (error) {
        setError(error.response ? error.response.data : "An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      setError("");
      setLoading(true);

      try {
        // Perform client-side validation
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match.");
        }

        // Call API to change password via PUT request
        await resetPasswordProfile(currentPassword, newPassword);
        setLoading(false);
        navigate("/profile");
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto p-8 border rounded-lg shadow-lg bg-white">
        {!success && (
          <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
            Password Reset
          </h2>
        )}
        {success ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">
              Password reset successful!
            </p>

            <p className="text-indigo-600 font-semibold mb-4">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              <span className="animate-pulse">Redirecting to login...</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isEmailLink && (
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentPasswordError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-green-600 cursor-pointer"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                >
                  <FontAwesomeIcon
                    icon={showCurrentPassword ? faEye : faEyeSlash}
                  />
                </span>
              </div>
            )}
            {currentPasswordError && (
              <p className="text-sm text-red-500 mt-1 pl-4">
                {currentPasswordError}
              </p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  newPasswordError ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span
                className="absolute top-1/2 right-3 -translate-y-1/2 text-green-600 cursor-pointer"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            {newPasswordError && (
              <p className="text-sm text-red-500 mt-1 pl-4">
                {newPasswordError}
              </p>
            )}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span
                className="absolute top-1/2 right-3 -translate-y-1/2 text-green-600 cursor-pointer"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                />
              </span>
            </div>
            {confirmPasswordError && (
              <p className="text-sm text-red-500 mt-1 pl-4">
                {confirmPasswordError}
              </p>
            )}
            {error && <p className="text-red-600 text-center">{error}</p>}
            <button
              type="submit"
              disabled={
                loading ||
                newPasswordError ||
                confirmPasswordError ||
                newPassword !== confirmPassword
              }
              className={`w-full bg-indigo-600 text-white px-4 py-2 rounded-lg relative ${
                loading ||
                newPasswordError ||
                confirmPasswordError ||
                newPassword !== confirmPassword
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;

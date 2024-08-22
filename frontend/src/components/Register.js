// src/components/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import backgroundImage from "../assets/background.jpg"; // Import your background image

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [retypePasswordError, setRetypePasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password) => {
    // Implement your password strength criteria
    return password.length >= 8; // Example: Require at least 8 characters
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.username.trim()) {
      setUsernameError("Username is required.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!formData.email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!formData.password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!isStrongPassword(formData.password)) {
      setPasswordError("Password should be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (formData.password !== formData.retypePassword) {
      setRetypePasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setRetypePasswordError("");
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the registerUser function from the API
      await registerUser(formData);
      setError("");

      // Use the navigate function to go to the /login route after successful registration
      navigate("/login");
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else {
        setError("Registration failed. Please try again.");
        console.error("Registration error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-md shadow-lg w-96">
          <h2 className="text-3xl font-bold mb-4 text-center text-green-500">
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-green-500 ${
                  usernameError ? "border-red-500" : ""
                }`}
              />
              {usernameError && (
                <p className="text-red-500 mt-1">{usernameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-green-500 ${
                  emailError ? "border-red-500" : ""
                }`}
              />
              {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-green-500 ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              <span
                className="absolute top-8 right-3 text-green-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
              {passwordError && (
                <p className="text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="retypePassword"
                className="block text-sm font-medium text-gray-600"
              >
                Retype Password:
              </label>
              <input
                type={showRetypePassword ? "text" : "password"}
                id="retypePassword"
                name="retypePassword"
                value={formData.retypePassword}
                onChange={handleInputChange}
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-green-500 ${
                  retypePasswordError ? "border-red-500" : ""
                }`}
              />
              <span
                className="absolute top-8 right-3 text-green-500 cursor-pointer"
                onClick={toggleRetypePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showRetypePassword ? faEye : faEyeSlash}
                />
              </span>
              {retypePasswordError && (
                <p className="text-red-500 mt-1">{retypePasswordError}</p>
              )}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div>
              <button
                type="submit"
                className={`w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {/* {loading ? "Registering..." : "Register"} */}
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
          <p className="mt-4 text-gray-600 text-center">
            Already have an account?
            <Link to="/login" className="text-green-500 hover:underline ml-1">
              Login here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

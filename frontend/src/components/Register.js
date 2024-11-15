// src/components/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
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

  const isStrongPassword = (password) => password.length >= 8;

  const validateForm = () => {
    let isValid = true;
    setUsernameError(formData.username.trim() ? "" : "Username is required.");
    setEmailError(formData.email.trim() ? "" : "Email is required.");
    if (!formData.password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (!isStrongPassword(formData.password)) {
      setPasswordError("Password should be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }
    setRetypePasswordError(
      formData.password === formData.retypePassword
        ? ""
        : "Passwords do not match."
    );
    return (
      isValid &&
      !usernameError &&
      !emailError &&
      !passwordError &&
      !retypePasswordError
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await registerUser(formData);
      setError("");
      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRetypePasswordVisibility = () =>
    setShowRetypePassword(!showRetypePassword);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center-"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 p-8 md:p-16 max-w-lg mx-auto rounded-3xl shadow-2xl bg-white bg-opacity-70">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`mt-2 p-3 w-full border ${
                usernameError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-2">{usernameError}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-2 p-3 w-full border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {emailError && (
              <p className="text-red-500 mt-2 text-xs">{emailError}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`mt-2 p-3 w-full border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <span
              className="absolute top-10 right-3 text-indigo-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
            {passwordError && (
              <p className="text-red-500 mt-2 text-xs">{passwordError}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="retypePassword"
              className="block text-sm font-medium text-gray-700"
            >
              Retype Password
            </label>
            <input
              type={showRetypePassword ? "text" : "password"}
              id="retypePassword"
              name="retypePassword"
              value={formData.retypePassword}
              onChange={handleInputChange}
              className={`mt-2 p-3 w-full border ${
                retypePasswordError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <span
              className="absolute top-10 right-3 text-indigo-500 cursor-pointer"
              onClick={toggleRetypePasswordVisibility}
            >
              <FontAwesomeIcon icon={showRetypePassword ? faEye : faEyeSlash} />
            </span>
            {retypePasswordError && (
              <p className="text-red-500 mt-2 text-xs">{retypePasswordError}</p>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-center mt-2 text-xs">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account ?{" "}
          <Link to="/login" className="text-indigo-700 hover:underline">
            <strong>Login here</strong>
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Register;

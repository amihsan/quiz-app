// src/components/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import PasswordResetEmail from "./PasswordResetEmail";
import backgroundImage from "../assets/background.jpg";

const Login = ({ role }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
    rememberMe: false,
  });

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.username_or_email.trim()) {
      setUsernameError("Username or Email is required.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!formData.password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await loginUser(formData);
      setError("");

      login(response.token, response.role);

      if (formData.rememberMe) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        document.cookie = `authToken=${
          response.token
        }; expires=${expirationDate.toUTCString()}; secure; path=/; samesite=strict; httponly`;
      }

      navigate("/");
    } catch (error) {
      if (error.message === "User not found. Please register.") {
        setError("User not found. Please register.");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetModalToggle = () => {
    setShowResetModal(!showResetModal);
  };

  const handleResetModalClose = () => {
    setShowResetModal(false);
  };

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
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username_or_email"
              className="block text-sm font-medium text-gray-700"
            >
              Username or Email:
            </label>
            <input
              type="text"
              id="username_or_email"
              name="username_or_email"
              value={formData.username_or_email}
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
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
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
              <p className="text-red-500 text-xs mt-2">{passwordError}</p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleCheckboxChange}
              className="mr-2 text-indigo-500 focus:ring-indigo-500 rounded"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember Me
            </label>
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={handleResetModalToggle}
          >
            Forgot Password?
          </span>
        </div>
        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-700 hover:underline">
            <strong>Register here</strong>
          </Link>
          .
        </p>
        {showResetModal && (
          <PasswordResetEmail onCancel={handleResetModalClose} />
        )}
      </div>
    </div>
  );
};

export default Login;

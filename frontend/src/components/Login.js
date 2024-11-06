// src/components/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import PasswordResetEmail from "./PasswordResetEmail";
import backgroundImage from "../assets/background.jpg"; // Import your background image

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

    // Basic client-side form validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);
      setError(""); // Clear any previous errors


      // Use the login function from context
      login(response.token, response.role);

      // If "Remember Me" is selected, store the token securely in a cookie
      if (formData.rememberMe) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // Example: Token expires in 7 days

        document.cookie = `authToken=${
          response.token
        }; expires=${expirationDate.toUTCString()}; secure; path=/; samesite=strict; httponly`;
      }

      // Use the navigate function to go to home page
      navigate("/");
    } catch (error) {
      console.log(error.data);
      if (error.message === "User not found. Please register.") {
        setError("User not found. Please register.");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false); // Ensure loading state is reset
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
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-md shadow-lg w-96">
          <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username_or_email"
                className="block text-sm font-medium text-gray-600"
              >
                Username or Email:
              </label>
              <input
                type="text"
                id="username_or_email"
                name="username_or_email"
                value={formData.username_or_email}
                onChange={handleInputChange}
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-600 ${
                  usernameError ? "border-red-500" : ""
                }`}
              />
              {usernameError && (
                <p className="text-red-500 mt-1">{usernameError}</p>
              )}
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
                className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-600 ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              <span
                className="absolute top-8 right-3 text-indigo-600 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
              {passwordError && (
                <p className="text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
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
          <div className="mt-4 text-gray-600 text-center">
            <span
              className="text-indigo-600 cursor-pointer hover:underline"
              onClick={handleResetModalToggle}
            >
              Forgot Password?
            </span>
          </div>
          <p className="mt-4 text-gray-600 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:underline ml-1"
            >
              Register here
            </Link>
            .
          </p>
        </div>
        {showResetModal && (
          <PasswordResetEmail onCancel={handleResetModalClose} />
        )}
      </div>
    </div>
  );
};

export default Login;

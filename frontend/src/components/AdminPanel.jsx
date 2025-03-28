import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminUser } from "../api.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext.jsx";
import backgroundImage from "../assets/background.jpg";

const AdminPanel = ({ role }) => {
  // Added backgroundImage as a prop
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      setError(null);
      if (!username.trim()) {
        setUsernameError("Username is required.");
        setLoading(false);
        return;
      }
      if (!password.trim()) {
        setPasswordError("Password is required.");
        setLoading(false);
        return;
      }

      const response = await loginAdminUser({ username, password });

      // Use the login function from context
      login(response.token, response.role);
      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          Admin Panel
        </h2>
        <input
          type="text"
          placeholder="Username"
          className={`w-full mb-4 p-2 rounded border border-gray-300 ${
            usernameError ? "border-red-500" : ""
          }`}
          value={username}
          onChange={handleUsernameChange}
        />
        {usernameError && <p className="text-red-500 mb-2">{usernameError}</p>}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full mb-4 p-2 rounded border border-gray-300 ${
              passwordError ? "border-red-500" : ""
            }`}
            value={password}
            onChange={handlePasswordChange}
          />
          <span
            className="absolute top-2 right-2 text-indigo-700 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none flex items-center justify-center"
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
    </div>
  );
};

export default AdminPanel;

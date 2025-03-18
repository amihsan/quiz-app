import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/question");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                className="w-full text-left text-gray-200 hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200"
                onClick={handleNavigate}
              >
                Manage Questions
              </button>
            </li>
            <li>
              <button className="w-full text-left text-gray-200 hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200">
                Analytics
              </button>
            </li>
            <li>
              <button className="w-full text-left text-gray-200 hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200">
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-700">
            Welcome, Admin
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Log Out
          </button>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Manage Quiz Questions
          </h2>
          <p className="text-gray-600 mb-6">
            Add, delete, or update quiz questions using the button below.
          </p>
          <button
            onClick={handleNavigate}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go to Question Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

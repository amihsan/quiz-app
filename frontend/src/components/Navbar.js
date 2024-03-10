// // src/components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    handleClick();
    navigate("/login");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClick = () => {
    setShowMenu(false);
  };

  return (
    <nav className="bg-indigo-600 p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center">
          <img src="/favicon.ico" alt="Favicon" className="w-6 h-6 mr-2" />
          Lebentest
        </Link>

        <div className="lg:hidden relative" ref={menuRef}>
          <button
            className="text-white hover:text-gray-300 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {showMenu ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"
                />
              )}
            </svg>
          </button>
          {showMenu && (
            <div className="absolute top-full right-0 mt-4 bg-white shadow-lg rounded-md w-40 z-10 ">
              <ul>
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                    onClick={handleClick}
                  >
                    Home
                  </Link>
                </li>
                {state.isAuthenticated ? (
                  <li>
                    <Link
                      to="/quiz"
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                      onClick={handleClick}
                    >
                      Quiz
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/"
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                      onClick={handleClick}
                    >
                      Quiz
                    </Link>
                  </li>
                )}

                {state.isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/question"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                        onClick={handleClick}
                      >
                        Quiz Questions
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                        onClick={handleClick}
                      >
                        Profile
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                        onClick={handleClick}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                        onClick={handleClick}
                      >
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                        onClick={handleClick}
                      >
                        Contact
                      </Link>
                    </li>
                  </>
                )}
                {state.isAuthenticated && (
                  <li>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                      onClick={handleClick}
                    >
                      Contact
                    </Link>
                  </li>
                )}
                {state.isAuthenticated && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-200 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="hidden lg:flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          {state.isAuthenticated ? (
            <Link to="/quiz" className="text-white hover:text-gray-300">
              Quiz
            </Link>
          ) : (
            <Link to="/" className="text-white hover:text-gray-300">
              Quiz
            </Link>
          )}

          {state.isAuthenticated ? (
            <>
              <Link to="/question" className="text-white hover:text-gray-300">
                Quiz Questions
              </Link>
              <Link to="/profile" className="text-white hover:text-gray-300">
                Profile
              </Link>
              <Link to="/contact" className="text-white hover:text-gray-300">
                Contact
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </>
          )}
          {!state.isAuthenticated && (
            <Link to="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

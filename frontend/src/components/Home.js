// src/components/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/background.jpg"; // Your local background image

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const image = new Image();
    image.src = backgroundImage;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        opacity: imageLoaded ? 1 : 0, // Smooth fade-in effect once image is loaded
        transition: "opacity 0.5s ease-in-out", // Smooth transition for image loading
      }}
    >
      {/* Gradient Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>

      <div className="relative z-10 p-8 md:p-16 max-w-lg mx-auto rounded-3xl shadow-xl bg-white bg-opacity-80 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600 mb-4 transform transition-transform duration-300 hover:scale-105">
          Welcome to <span className="text-green-500">Einbürgerungstest</span>{" "}
          Quiz
        </h1>

        <p className="text-lg md:text-xl text-gray-800 mb-8">
          This is a free online learning platform for the German Integration (
          <strong>Einbürgerung</strong>) Test. Take the quiz to test your
          knowledge! We offer different categories to help you learn and
          prepare. Choose a category and start learning today!
        </p>

        <p className="text-lg md:text-xl text-gray-600 mb-8">
          {isLoggedIn
            ? "Ready to begin? Start now!"
            : "To participate in the quiz, please log in."}
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {isLoggedIn ? (
            <Link to="/quiz">
              <button className="w-full md:w-40 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-3 px-6 rounded-xl text-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none">
                Start Quiz
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button className="w-full md:w-40 bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white py-3 px-6 rounded-xl text-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="w-full md:w-40 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-white py-3 px-6 rounded-xl text-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Optional Information Section */}
        {!isLoggedIn && (
          <div className="mt-8 text-center text-gray-700">
            <p className="text-lg">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition duration-300"
              >
                Register now
              </Link>{" "}
              and join the quiz fun!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

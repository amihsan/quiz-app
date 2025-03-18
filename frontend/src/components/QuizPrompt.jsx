// src/components/QuizPrompt.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/background.jpg"; // Your local background image

const QuizPrompt = () => {
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
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

      <div className="relative z-10 p-8 md:p-16 max-w-lg mx-auto rounded-3xl shadow-2xl bg-white bg-opacity-70">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 transform transition-transform duration-300 hover:scale-105">
          Ready to Start the Quiz?
        </h2>

        <p className="text-lg text-center text-gray-800 mb-8">
          {isLoggedIn
            ? "Click below to begin your quiz and test your knowledge!"
            : "To take part in the quiz, please log in first. It's quick and easy!"}
        </p>

        {isLoggedIn ? (
          <Link to="/quiz">
            <button className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white py-3 px-6 rounded-xl text-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none">
              Start Quiz
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white py-3 px-6 rounded-xl text-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none">
              Login to Continue
            </button>
          </Link>
        )}

        {/* Optional: Registration prompt */}
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold transition duration-300"
            >
              Register now
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPrompt;

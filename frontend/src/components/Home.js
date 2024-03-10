// src/components/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoggedInStatus = () => {
    // Your logic to check if the user is logged in
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-md shadow-lg bg-white text-center">
        <h3 className="text-3xl font-extrabold mb-4 text-blue-600">
          Welcome to <span className="text-green-500">"Lebentest"</span>
          Quiz
        </h3>
        {!isLoggedIn && (
          <>
            <p className="text-lg font-semibold mb-4">
              If you are planning to take the German Integration Test, this is
              the right place. There are different question categories
              available. Each category has different number of questions. You
              can start learning easily by choosing any categories of your
              choice. You will get instant feedback with your answer. You will
              also get the final result after completing the quiz.
            </p>
            <p className="text-lg font-semibold mb-4">
              To take part in the quiz, please log in.
            </p>
            <Link to="/login">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none transform transition-transform duration-300 hover:scale-105">
                Login
              </button>
            </Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <p className="text-lg font-semibold mb-4">
              If you are planning to take the German Integration Test, this is
              the right place. There are different question categories
              available. Each category has different number of questions. You
              can start learning easily by choosing any categories of your
              choice. You will get instant feedback with your answer. You will
              also get the final result after completing the quiz.
            </p>
            <p className="text-lg font-semibold mb-4"> Get started now!</p>
            <Link to="/quiz">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none transform transition-transform duration-300 hover:scale-105">
                Start Quiz
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

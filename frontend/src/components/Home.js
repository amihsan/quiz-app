// // src/components/Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/background.jpg"; // Import your background image

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

  const renderIntroParagraph = () => {
    return (
      <p className="text-lg font-semibold mb-4">
        If you are planning to take the German Integration Test, this is the
        right place. There are different question categories available. Each
        category has a different number of questions. You can start learning
        easily by choosing any categories of your choice. You will get instant
        feedback with your answer. You will also get the final result after
        completing the quiz.
      </p>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        opacity: imageLoaded ? 1 : 0, // Show only when image is loaded
        transition: "opacity 0.5s ease-in-out", // Smooth transition
      }}
    >
      <div className="p-8 rounded-md shadow-lg bg-opacity-50 bg-black text-center">
        <h3 className="text-3xl font-extrabold mb-4 text-blue-400">
          Welcome to <span className="text-green-400">"Lebentest"</span> Quiz
        </h3>

        {renderIntroParagraph()}

        <p className="text-lg font-semibold mb-8">
          {isLoggedIn
            ? "Get started now!"
            : "To take part in the quiz, please log in."}
        </p>

        {isLoggedIn ? (
          <Link to="/quiz">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none transform transition-transform duration-300 hover:scale-105">
              Start Quiz
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none transform transition-transform duration-300 hover:scale-105">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;






// src/components/Results.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizQuestions, userAnswers, selectedCategory, categories } =
    location.state;
  const [totalScore, setTotalScore] = useState(0);

  const selectedCategoryLabel =
    categories.find((category) => category.name === selectedCategory)?.label ||
    "Unknown Category";

  // console.log(categories);
  // console.log(userAnswers);
  // console.log(selectedCategory);

  // Function to calculate the total score
  useEffect(() => {
    const calculateScore = () => {
      const score =
        userAnswers.filter((answer) => answer.isCorrect).length * 10;
      setTotalScore(score);
    };

    calculateScore();
  }, [userAnswers]);

  const handleResetQuiz = () => {
    navigate("/quiz", {
      state: {
        selectedCategory: selectedCategory,
      },
    });
  };

  // Function to render individual question results
  const renderResults = () => {
    return quizQuestions.map((question, index) => (
      <li key={index} className="border p-4 rounded-md bg-white shadow-md">
        {/* Render question text */}
        <p className="text-lg font-semibold mb-2">{question.text}</p>
        {/* Render user's answer */}
        <div className="flex items-center mb-2">
          <span className="text-indigo-600 mr-2">Your Answer:</span>
          <span className="text-lg">
            {userAnswers[index]?.selectedOption || "Not answered"}
          </span>
        </div>
        {/* Render result (correct/incorrect) */}
        <div className="flex items-center mb-2">
          <span className="text-indigo-600 mr-2">Result:</span>
          <span
            className={`text-lg font-semibold ${
              userAnswers[index]?.isCorrect ? "text-green-500" : "text-red-500"
            }`}
          >
            {userAnswers[index]?.isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>
        {/* Render correct answer */}
        <div className="flex items-center mb-2">
          <span className="text-indigo-600 mr-2">Correct Answer:</span>
          <span className="text-lg">{question.correctAnswer}</span>
        </div>
      </li>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col  items-center justify-center bg-gray-100">
      <div className=" p-8 rounded-md shadow-lg bg-white ">
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600 ">
          Quiz Results (
          <span className=" text-red-500 ">{selectedCategoryLabel}</span>)
        </h2>
        {/* Display total score */}
        <div className="text-3xl font-bold mb-4 text-center text-green-600">
          Total Score: {totalScore}
        </div>

        {/* Render individual question results */}

        <ul className="grid gap-4 md:grid-cols-3 md:gap-4 md:auto-cols-min">
          {renderResults()}
        </ul>

        {/* Button to reset quiz */}
        <div className="mt-4 text-gray-600 text-center">
          <button
            className="text-white font-semibold bg-indigo-600 py-2 px-4 rounded-full shadow-md hover:bg-indigo-700 hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={handleResetQuiz}
          >
            Start the quiz again !
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

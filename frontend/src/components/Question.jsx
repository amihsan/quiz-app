// src/components/Question.jsx
import React, { useState, useEffect } from "react";

const Question = ({
  currentIndex,
  quizQuestions,
  handleNextQuestion,
  handlePrevQuestion,
  handleAnswerChange,
  handleSubmit,
  answeredFirstTime,
  setAnsweredFirstTime,
}) => {
  const question = quizQuestions[currentIndex];
  const [selectedOption, setSelectedOption] = useState("");
  const [showError, setShowError] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  // Update selectedOption when currentIndex changes
  useEffect(() => {
    setSelectedOption(question.selectedOption);
  }, [currentIndex, question.selectedOption]);

  // Update allQuestionsAnswered whenever answeredFirstTime changes
  useEffect(() => {
    const allAnswered = answeredFirstTime.every((answered) => answered);
    setAllQuestionsAnswered(allAnswered);
  }, [answeredFirstTime]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    handleAnswerChange(option);

    // Check if the question is being answered for the first time
    if (!answeredFirstTime[currentIndex]) {
      // Set answeredFirstTime for this question to true
      setAnsweredFirstTime((prev) => {
        const updatedAnsweredFirstTime = [...prev];
        updatedAnsweredFirstTime[currentIndex] = true;
        return updatedAnsweredFirstTime;
      });
    }

    // Hide the error message when an option is selected
    setShowError(false);
  };

  const handleNextOrError = () => {
    if (selectedOption) {
      handleNextQuestion();
    } else {
      // Display the error message
      setShowError(true);
    }
  };

  const handleFinalSubmit = () => {
    if (allQuestionsAnswered) {
      handleSubmit();
    } else {
      // Display error message if all questions are not answered
      setShowError(true);
    }
  };

  return (
    <div>
      <p className="text-2xl font-bold mb-4">{question.text}</p>
      <div className="text-center mb-1">
        {question.picture_link && (
          <img
            src={question.picture_link}
            alt="Question"
            className="mx-auto mb-4"
          />
        )}
      </div>
      {question.options.map((option) => (
        <div key={option} className="mb-4">
          <label
            htmlFor={`${question.text}-${option}`}
            className={`relative block cursor-pointer p-4 border rounded-md transition duration-300 ease-in-out ${
              selectedOption === option
                ? question.isCorrect
                  ? "bg-green-100 border-green-400"
                  : "bg-red-100 border-red-400"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              id={`${question.text}-${option}`}
              name={question.text}
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className="hidden"
            />
            <span className="text-lg text-indigo-600">{option}</span>
            {selectedOption === option && (
              <span
                className={`absolute top-2 right-2 p-1 text-white ${
                  question.isCorrect ? "bg-green-500" : "bg-red-500"
                } rounded-full`}
              >
                {question.isCorrect ? "✓" : "✕"}
              </span>
            )}
          </label>
        </div>
      ))}
      {showError && (
        <div className="text-red-500 mt-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Please select an answer before proceeding.</span>
        </div>
      )}
      {question.isAnswered !== undefined && (
        <p
          className={`mt-4 text-lg font-semibold ${
            question.isCorrect ? "text-green-500" : "text-red-500"
          }`}
        >
          {question.isCorrect ? "Correct!" : "Incorrect!"}
        </p>
      )}

      <div className="mt-6 flex justify-between">
        {currentIndex > 0 && (
          <button
            type="button"
            className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 focus:outline-none"
            onClick={handlePrevQuestion}
          >
            Previous
          </button>
        )}
        {currentIndex < quizQuestions.length - 1 && (
          <button
            type="button"
            className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 focus:outline-none"
            onClick={handleNextOrError}
          >
            Next
          </button>
        )}
        {currentIndex === quizQuestions.length - 1 && (
          <button
            type="button"
            className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 focus:outline-none"
            onClick={handleFinalSubmit}
            // disabled={!allQuestionsAnswered}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Question;

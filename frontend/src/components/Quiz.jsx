// src/components/Quiz.jsx
import React, { useState, useEffect } from "react";
import { getQuizQuestionsByCategory, getCategories } from "../api.jsx";
import Question from "./Question.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faInfoCircle,
  faTh,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryButton, setSelectedCategoryButton] = useState("");

  const [showCategory, setShowCategory] = useState(false);

  // Get selectedCategory from localStorage,
  const selectedCategoryFromLocalStorage =
    localStorage.getItem("selectedCategory");

  //  default to "Category1(Verfassungsorgane)" if not available
  const defaultSelectedCategory =
    selectedCategoryFromLocalStorage || "Category1";

  // Get selectedCategory from location state, handle null case
  const selectedCategoryFromResults = location.state
    ? location.state.selectedCategory
    : null;

  // Initialize with the selectedCategory from the location state's
  // name property, default to "Category1" if not available
  const [selectedCategory, setSelectedCategory] = useState(
    selectedCategoryFromResults
      ? selectedCategoryFromResults
      : defaultSelectedCategory
  );

  const [answeredFirstTime, setAnsweredFirstTime] = useState(
    Array(quizQuestions.length).fill(false)
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      setLoadingQuestions(true);
      try {
        // Simulate loading delay for better user experience
        setTimeout(async () => {
          const response = await getQuizQuestionsByCategory(selectedCategory);
          setQuizQuestions(response.questions || []);
          setUserAnswers([]);
          setCurrentIndex(0);
          setLoadingQuestions(false);
          setSubmitted(false);
          setAnsweredFirstTime(Array(response.questions.length).fill(false));
          setTotalScore(0); // Reset total score
        }, 100);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setLoadingQuestions(false);
      }
    };

    fetchQuizQuestions();
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategoryButton(defaultSelectedCategory);
    setSelectedCategory(defaultSelectedCategory);
  }, [defaultSelectedCategory]);

  useEffect(() => {
    // Store the selected category in localStorage whenever it changes
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (newSelectedCategory) => {
    setSelectedCategoryButton(newSelectedCategory);
    setSelectedCategory(newSelectedCategory);
    localStorage.setItem("selectedCategory", newSelectedCategory);
  };

  const handleClick = (categoryName) => {
    handleCategoryChange(categoryName);
    navigate(`/quiz/questions/category/${categoryName}`);
  };

  const handleAnswerChange = (selectedOption) => {
    const currentQuestion = quizQuestions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (!answeredFirstTime[currentIndex]) {
      setUserAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentIndex] = {
          question: currentQuestion.text || "",
          selectedOption,
          isCorrect,
        };
        return updatedAnswers;
      });

      setAnsweredFirstTime((prevAnsweredFirstTime) => {
        const updatedAnsweredFirstTime = [...prevAnsweredFirstTime];
        updatedAnsweredFirstTime[currentIndex] = true;
        return updatedAnsweredFirstTime;
      });

      if (isCorrect) {
        // Increment total score if the answer is correct
        setTotalScore((prevScore) => prevScore + 10);
      }
    }

    setQuizQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentIndex] = {
        ...currentQuestion,
        selectedOption,
        isCorrect,
        isAnswered: true,
      };
      return updatedQuestions;
    });
  };

  const handleNextQuestion = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, quizQuestions.length - 1)
    );
  };

  const handlePrevQuestion = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);

      // Add a delay of 1 second (1000 milliseconds)
      setTimeout(() => {
        navigate("/results", {
          state: {
            quizQuestions: quizQuestions,
            userAnswers: userAnswers,
            selectedCategory: selectedCategory,
            categories: categories,
          },
        });

        // Reset loading state after navigation
        setSubmitted(false);
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleShowCategory = () => {
    setShowCategory(!showCategory);
  };

  const renderQuestionProgress = () => {
    const progress = ((currentIndex + 1) / quizQuestions.length) * 100;
    return (
      <div className="mb-4">
        <progress className="w-full" value={progress} max="100">
          {progress}%
        </progress>
        <p className="text-sm text-gray-600 text-center mt-1">
          Question{" "}
          <span className="text-indigo-700 font-semibold">
            {currentIndex + 1}
          </span>{" "}
          of{" "}
          <span className="text-indigo-700 font-semibold">
            {quizQuestions.length}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      {loadingQuestions ? (
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Loading ...</span>
        </div>
      ) : submitted ? (
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Submitting ...</span>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-md shadow-lg w-full ">
          {!submitted && (
            <div className="mb-4 ">
              <div className="flex item-center justify-between">
                <button
                  className=" px-3 py-1 bg-gray-200 rounded-md text-sm font-semibold hover:bg-gray-300 focus:outline-none focus:bg-gray-300 text-blue-800"
                  onClick={handleShowCategory}
                >
                  {showCategory ? "Hide Category" : "Show Categories"}

                  <FontAwesomeIcon icon={faTh} className="ml-1 text-blue-700" />
                </button>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className=" px-3 py-1 bg-gray-200 rounded-md text-sm font-semibold hover:bg-gray-300 focus:outline-none focus:bg-gray-300 text-gray-800"
                >
                  {showHelp ? "Hide Help" : "Show Help"}
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="ml-1 text-green-700"
                  />
                </button>
              </div>
              {showCategory && (
                <div className="flex flex-wrap ">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleClick(category.name)} // Pass the category name to handleClick
                      className={`mr-4 mb-2 ${
                        selectedCategoryButton === category.name
                          ? "text-green-600 underline font-bold"
                          : "text-blue-600 underline hover:text-blue-800 focus:outline-none"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}

              {showHelp && (
                <p className="text-sm mt-2 mr-0 text-gray-800">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-green-700 mr-1"
                  />
                  <span>
                    Select a question set from the available category. Answer
                    each question before moving to the next one. After answering
                    all questions, submit your quiz for evaluation.
                  </span>
                </p>
              )}
            </div>
          )}
          {!submitted && (
            <>
              <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">
                Quiz
              </h2>

              {renderQuestionProgress()}
              <div className="text-2xl font-bold mb-4 text-center text-green-600">
                Score: {totalScore}
              </div>
              <Question
                currentIndex={currentIndex}
                quizQuestions={quizQuestions}
                handleNextQuestion={handleNextQuestion}
                handlePrevQuestion={handlePrevQuestion}
                handleAnswerChange={handleAnswerChange}
                handleSubmit={handleSubmit}
                answeredFirstTime={answeredFirstTime}
                setAnsweredFirstTime={setAnsweredFirstTime}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;

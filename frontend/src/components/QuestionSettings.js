// src/components/QuestionsList.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import {
  getCategories,
  getQuizQuestionsByCategory,
  deleteQuizQuestion,
} from "../api";

const QuestionSettings = () => {
  const { role } = useAuth();
  const location = useLocation();
  const categoryFromLocation = location.state?.category || "";
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || categoryFromLocation || ""
  );
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    const fetchQuestionsByCategory = async (categoryName) => {
      try {
        setLoadingQuestions(true);

        const response = await getQuizQuestionsByCategory(categoryName);
        setQuestions(response.questions);
        setLoadingQuestions(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoadingQuestions(false);
      }
    };

    fetchQuestionsByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
    localStorage.setItem("selectedCategory", selectedCategory);
  };

  const handleDelete = async (questionId) => {
    setShowConfirmation(true);
    setQuestionToDelete(questionId);
  };

  const handleDeleteConfirmation = async (questionId) => {
    setShowConfirmation(false);
    setIsDeleting(true);

    try {
      await deleteQuizQuestion(selectedCategory, questionId);
      setQuestions(questions.filter((question) => question._id !== questionId));
      setSuccessMessage("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Error deleting question. Please try again later.");
    } finally {
      setShowConfirmation(false);
      setIsDeleting(false);
    }
  };

  const handleSuccessMessageClick = () => {
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {loadingQuestions && (
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Loading ...</span>
        </div>
      )}

      {successMessage && (
        <div className="flex flex-col items-center bg-white rounded-lg p-4 md:p-12">
          <p className="text-green-500">{successMessage}</p>
          <Link
            to="/question"
            className="text-blue-500 font-semibold mt-2"
            onClick={handleSuccessMessageClick}
          >
            Go to Questions List
          </Link>
        </div>
      )}

      {isDeleting && (
        <div className="flex items-center bg-white rounded-lg p-4 md:p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Deleting ...</span>
        </div>
      )}

      {!loadingQuestions && !isDeleting && successMessage === "" && (
        <div className="w-full p-4 md:p-8 rounded-md shadow-lg bg-white">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">
            Quiz Questions
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <label htmlFor="category" className="mr-2 font-semibold">
                Select a category:
              </label>
              <select
                id="category"
                className="border p-2 rounded appearance-none mb-2 md:mb-0"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            {role === "admin" && selectedCategory && (
              <Link
                to="/add"
                className="bg-green-600 text-white px-4 py-2 rounded inline-block hover:bg-green-700"
              >
                Add New Question
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-gray-200 rounded-lg p-4 flex flex-col h-full"
              >
                <div className="question-content flex-grow">
                  <p className="font-bold mb-2">Question No: {index + 1}</p>
                  <p className="mb-2">{question.text}</p>
                  <ul className="list-disc pl-6">
                    {question.options.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-indigo-600">
                    Correct Answer:{" "}
                    <span className="text-black">{question.correctAnswer}</span>
                  </p>

                  <div className="text-center mb-1">
                    {question.picture_link && (
                      <img
                        src={question.picture_link}
                        alt="Question"
                        className="mx-auto mb-4 max-w-full h-auto"
                      />
                    )}
                  </div>
                </div>
                {selectedCategory && role === "admin" && (
                  <div className="mt-auto flex justify-between">
                    <Link
                      to={`/update/${selectedCategory}/${question._id}`}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded inline-block"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded inline-block"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">Are you sure you want to delete this question?</p>
          <div className="flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                handleDeleteConfirmation(questionToDelete);
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSettings;

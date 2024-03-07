// src/components/QuestionsList.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getCategories, getQuizQuestionsByCategory } from "../api";

const QuestionsList = () => {
  const location = useLocation();
  const categoryFromLocation = location.state?.category || "";
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || categoryFromLocation || ""
  );
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

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
          <span className="text-lg font-semibold">
            Loading Quiz Questions...
          </span>
        </div>
      )}

      {!loadingQuestions && (
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question, index) => (
              <div key={question._id} className="bg-gray-200 rounded-lg p-4">
                <p className="font-bold mb-2">Question No: {index + 1}</p>
                <p className="mb-2">{question.text}</p>
                <ul className="list-disc pl-6">
                  {question.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
                <p className="mt-2 ">
                  <span className="text-indigo-600 font-semibold">
                    Correct Answer:
                  </span>{" "}
                  {question.correctAnswer}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;

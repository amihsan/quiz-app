// src/components/AddQuestionForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addQuizQuestion, getCategories } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const AddQuestionForm = () => {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    image: null,
    category: "",
  });
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({
      ...questionData,
      options: newOptions,
    });
  };

  const handleImageChange = (e) => {
    setQuestionData({
      ...questionData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setShowForm(false);

    try {
      await addQuizQuestion(questionData);
      setQuestionData({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        image: null,
        category: "",
      });
      setIsLoading(false);
      setSuccessMessage("Question added successfully!");
    } catch (error) {
      console.error("Error adding question:", error);
      setError("Failed to add question. Please try again.");
    }
  };

  const validateForm = () => {
    if (!questionData.text.trim()) {
      setError("Question text is required.");
      return false;
    }
    if (questionData.options.some((option) => !option.trim())) {
      setError("All options must be filled out.");
      return false;
    }
    if (!questionData.correctAnswer.trim()) {
      setError("Correct answer is required.");
      return false;
    }
    if (!questionData.category.trim()) {
      setError("Question category is required.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSuccessMessageClick = () => {
    // Redirect to the questions list page
    navigate("/question");
    // Clear the success message
    setSuccessMessage("");
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col  items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Adding ...</span>
        </div>
      )}
      {successMessage && (
        <div className="flex flex-col items-center bg-white rounded-lg p-12">
          <p className="text-green-500">{successMessage}</p>
          <button
            className="text-blue-500 font-semibold mt-2"
            onClick={handleSuccessMessageClick}
          >
            Go to Questions List
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 w-full max-w-lg">
          {error}
        </div>
      )}
      {showForm && (
        <div className="w-full p-8 rounded-md shadow-lg bg-white">
          <h2 className="text-3xl text-indigo-600 font-bold mb-6">
            Add New Question
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="flex flex-col">
              <label htmlFor="question" className="text-gray-700 font-semibold">
                Question Text:
              </label>
              <input
                id="question"
                type="text"
                name="text"
                value={questionData.text}
                onChange={handleChange}
                required
                className="mt-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col">
                <label
                  htmlFor={`option-${index + 1}`}
                  className="text-gray-700 font-semibold"
                >
                  Option {index + 1}:
                </label>
                <input
                  id={`option-${index + 1}`}
                  type="text"
                  value={questionData.options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="mt-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div className="flex flex-col">
              <label
                htmlFor="correctAnswer"
                className="text-gray-700 font-semibold"
              >
                Correct Answer:
              </label>
              <input
                id="correctAnswer"
                type="text"
                name="correctAnswer"
                value={questionData.correctAnswer}
                onChange={handleChange}
                required
                className="mt-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="category" className="text-gray-700 font-semibold">
                Question Category:
              </label>
              <select
                id="category"
                name="category"
                value={questionData.category}
                onChange={handleChange}
                required
                className="mt-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="image" className="text-gray-700 font-semibold">
                Upload Image:
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
              <span className="text-gray-500 text-sm mt-1">
                Optional: You can upload an image for this question.
              </span>
            </div>
            <button
              type="submit"
              className="mt-8 bg-green-600 text-white px-4 py-2 rounded inline-block hover:bg-green-700"
            >
              Add Question
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddQuestionForm;

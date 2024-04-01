// src/components/UpdateQuestionForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionById, updateQuizQuestion } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const UpdateQuestionForm = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionData = await getQuestionById(category, id);
        setFormData(questionData);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("Error fetching question. Please try again.");
      }
    };

    fetchQuestion();
  }, [category, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.text ||
      formData.options.length < 2 ||
      !formData.correctAnswer
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setShowForm(false);
    setError(""); // Clear any previous errors

    try {
      const updatedFormData = { ...formData, category: category };
      await updateQuizQuestion(category, updatedFormData);

      // Set success message
      setSuccessMessage("Question updated successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
      setError("Error updating question. Please try again.");
    } finally {
      // Always clear loading state
      setIsLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const newOptions = [...prevFormData.options];
      newOptions[index] = value;
      return { ...prevFormData, options: newOptions };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }));
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  const handleSuccessMessageClick = () => {
    // Clear the success message
    setSuccessMessage("");
    // Redirect to the questions list page
    navigate("/question");
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
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
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {showForm && (
        <div className="w-full p-8 rounded-md shadow-lg bg-white">
          <h2 className="text-3xl text-indigo-600 font-bold mb-6">
            Edit Question
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              Category:
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="border border-gray-300 px-4 py-2 mt-2 w-full rounded"
              />
            </label>
            <label className="block mb-4">
              Question Text:
              <input
                type="text"
                name="text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="border border-gray-300 px-4 py-2 mt-2 w-full rounded"
              />
            </label>
            {formData.options.map((option, index) => (
              <label key={index} className="block mb-4">
                Option {index + 1}:
                <input
                  type="text"
                  name={`option${index + 1}`}
                  value={option}
                  onChange={(e) => handleChange(e, index)}
                  className="border border-gray-300 px-4 py-2 mt-2 w-full rounded"
                />
              </label>
            ))}
            <label className="block mb-4">
              Correct Answer:
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={(e) =>
                  setFormData({ ...formData, correctAnswer: e.target.value })
                }
                className="border border-gray-300 px-4 py-2 mt-2 w-full rounded"
              />
            </label>
            <div className="flex flex-col mb-4">
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
                Optional: You can change or upload an image for this question.
              </span>
            </div>
            {formData.picture_link && (
              <img
                src={formData.picture_link}
                alt="QuestionPicture"
                className="block mb-4"
              />
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Update Question
            </button>
          </form>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Updating Questions...</span>
        </div>
      )}
    </div>
  );
};

export default UpdateQuestionForm;

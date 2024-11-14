// src/api.js
import axios from "axios";

// Access the API URL from environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_URL || window._env_.REACT_APP_API_URL;
// const API_BASE_URL = process.env.REACT_APP_API_URL;
// const API_BASE_URL = "";  // Kubernetes

// Function to log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("User not found. Please register.");
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

// Function to log in as a admin
export const loginAdminUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/login`,
      credentials,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("User not found. Please register.");
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get the user profile
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to update user profile
export const updateProfile = async (updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/profile`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to submit the quiz
export const submitQuiz = async (answers) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/quiz/submit`,
      { answers },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Assuming the response includes feedback
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get quiz questions from mongodb collections
export const getQuizQuestions = async (selectedSet) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/quiz/questions/${selectedSet}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to add a new quiz question to the database
export const addQuizQuestion = async (questionData) => {
  try {
    const formData = new FormData();
    formData.append("questionData", JSON.stringify(questionData)); // Convert object to JSON string

    // Conditionally append the image if it exists
    if (questionData.image) {
      formData.append("image", questionData.image); // Append the image file
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/quiz/questions/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Make sure the response.data is returning the correct format
  } catch (error) {
    throw error.response.data;
  }
};

export const updateQuizQuestion = async (category, questionData) => {
  try {
    const formData = new FormData();
    formData.append("category", category); // Append category
    formData.append("question_id", questionData.questionId); // Append question ID
    formData.append("questionData", JSON.stringify(questionData)); // Convert object to JSON string

    // Conditionally append the image if it exists
    if (questionData.image) {
      formData.append("image", questionData.image); // Append the image file
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/quiz/questions/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Make sure the response.data is returning the correct format
  } catch (error) {
    throw error.response.data;
  }
};

// Function to delete an existing quiz question from the database
export const deleteQuizQuestion = async (selectedCategory, questionId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/quiz/questions/delete`,
      { question_id: questionId, category: selectedCategory },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Make sure the response.data is returning the correct format
  } catch (error) {
    throw error.response.data;
  }
};

// Function to fetch a quiz question by ID from the database
export const getQuestionById = async (categoryName, questionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/quiz/questions/${categoryName}/${questionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data; // Assuming the question data is returned directly from the endpoint
  } catch (error) {
    throw error.response.data;
  }
};

// Function to send user password reset link in email
export const resetPassword = async (email, token) => {
  try {
    // Send a POST request to the reset-password endpoint
    const response = await axios.post(
      `${API_BASE_URL}/api/reset-password`, // Endpoint URL
      { email, token } // Request payload containing the email and token
    );
    return response.data; // Assuming the response includes a success message
  } catch (error) {
    throw error.response.data; // Throw detailed error message from the server
  }
};

// Function to reset user password with token from email
export const resetPasswordEmail = async (token, newPassword) => {
  try {
    // Send a POST request to the reset-password endpoint
    const response = await axios.post(
      `${API_BASE_URL}/api/reset-password/${token}`, // Endpoint URL with token as part of the URL
      { new_password: newPassword } // Request payload containing the new_password
    );
    return response.data; // Assuming the response includes a success message
  } catch (error) {
    throw error.response.data; // Throw detailed error message from the server
  }
};

// Function to reset user password from profile
export const resetPasswordProfile = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_BASE_URL}/api/reset-password`,
      { current_password: currentPassword, new_password: newPassword }, // Ensure correct property names
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Assuming the response includes a success message
  } catch (error) {
    throw error.response.data; // Throw detailed error message from the server
  }
};

// Function to upload user profile picture/avatar
export const uploadAvatar = async (avatarFile) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", avatarFile);
    const response = await axios.post(
      `${API_BASE_URL}/api/upload-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.avatar_url;
  } catch (error) {
    throw error;
  }
};

// Function to get quiz questions from mongodb collections based on category
export const getQuizQuestionsByCategory = async (selectedCategory) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/quiz/questions/category/${selectedCategory}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get mongodb collections based on category
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/categories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.categories;
  } catch (error) {
    throw error.response.data;
  }
};

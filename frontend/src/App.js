// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import Quiz from "./components/Quiz";
import PasswordReset from "./components/PasswordReset";
import Results from "./components/Results";
import AddQuestionForm from "./components/AddQuestionForm";
import QuestionsList from "./components/QuestionsList";
import UpdateQuestionForm from "./components/UpdateQuestionForm";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import QuestionSettings from "./components/QuestionSettings";

const App = () => {
  const isEmailLink = true;
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto mt-8 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route
              path="/quiz/questions/category/:categoryName"
              element={<Quiz />}
            />
            <Route
              path="/reset-password"
              element={<PasswordReset isEmailLink={!isEmailLink} />}
            />
            <Route
              path="/reset-password/:token"
              element={<PasswordReset isEmailLink={isEmailLink} />}
            />
            <Route path="/results" element={<Results />} />
            <Route path="/add" element={<AddQuestionForm />} />
            <Route path="/question" element={<QuestionsList />} />
            <Route
              path="/update/:category/:id"
              element={<UpdateQuestionForm />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/question/settings" element={<QuestionSettings />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;

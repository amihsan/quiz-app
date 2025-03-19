// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";
import Footer from "./components/Footer.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Quiz from "./components/Quiz.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import Results from "./components/Results.jsx";
import AddQuestionForm from "./components/AddQuestionForm.jsx";
import UpdateQuestionForm from "./components/UpdateQuestionForm.jsx";
import Contact from "./components/Contact.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import QuestionSettings from "./components/QuestionSettings.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import QuizPrompt from "./components/QuizPrompt.jsx";

const App = () => {
  const isEmailLink = true;
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen w-full flex flex-col">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/quiz-prompt" element={<QuizPrompt />} />
              <Route
                path="/reset-password"
                element={<PasswordReset isEmailLink={!isEmailLink} />}
              />
              <Route
                path="/reset-password/:token"
                element={<PasswordReset isEmailLink={isEmailLink} />}
              />

              {/* <Route path="/quiz" element={<Quiz />} /> */}
              {/* Protected Route for User */}
              <Route
                path="/quiz"
                element={
                  <PrivateRoute requiredRoles={["user", "admin"]}>
                    <Quiz />
                  </PrivateRoute>
                }
              />

              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* Protected Route for User */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute requiredRoles={["user", "admin"]}>
                    <Profile />
                  </PrivateRoute>
                }
              />
              {/* <Route path="/add" element={<AddQuestionForm />} /> */}
              {/* Protected Route for Admin */}
              <Route
                path="/add"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AddQuestionForm />
                  </PrivateRoute>
                }
              />
              {/* <Route
                path="/quiz/questions/category/:categoryName"
                element={<Quiz />}
              /> */}
              {/* Protected Route for User */}
              <Route
                path="/quiz/questions/category/:categoryName"
                element={
                  <PrivateRoute requiredRoles={["user", "admin"]}>
                    <Quiz />
                  </PrivateRoute>
                }
              />

              {/* <Route path="/results" element={<Results />} /> */}
              {/* Protected Route for User */}
              <Route
                path="/results"
                element={
                  <PrivateRoute requiredRoles={["user", "admin"]}>
                    <Results />
                  </PrivateRoute>
                }
              />

              {/* <Route
                path="/update/:category/:id"
                element={<UpdateQuestionForm />}
              /> */}
              {/* Protected Route for Admin */}
              <Route
                path="/update/:category/:id"
                element={
                  <PrivateRoute requiredRole="admin">
                    <UpdateQuestionForm />
                  </PrivateRoute>
                }
              />

              {/* <Route path="/admin" element={<AdminPanel />} /> */}
              {/* Protected Route for User */}
              <Route
                path="admin"
                element={
                  <PrivateRoute requiredRole="user">
                    <AdminPanel />
                  </PrivateRoute>
                }
              />

              {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
              {/* Protected Route for Admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              {/* <Route path="/question" element={<QuestionSettings />} /> */}
              {/* Protected Route for Admin */}
              <Route
                path="/question"
                element={
                  <PrivateRoute requiredRoles={["user", "admin"]}>
                    <QuestionSettings />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

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
import UpdateQuestionForm from "./components/UpdateQuestionForm";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import AdminDashboard from "./components/AdminDashboard";
import QuestionSettings from "./components/QuestionSettings";
import UnauthorizedPage from "./components/UnauthorizedPage";
import PrivateRoute from "./components/PrivateRoute";
import QuizPrompt from "./components/QuizPrompt";

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

// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

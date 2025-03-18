// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="bg-blue-600 p-4 text-white text-center">
      <p className="text-sm">
        &copy; {currentYear}{" "}
        <span className="font-bold">Ihsan@Einbürgerungstest</span>. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;


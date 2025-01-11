// src/components/Contact.js
import React, { useState, useEffect } from "react";
import backgroundImage from "../assets/background.jpg"; // Your local background image

const Contact = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = backgroundImage;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        opacity: imageLoaded ? 1 : 0, // Smooth fade-in effect once image is loaded
        transition: "opacity 0.5s ease-in-out", // Smooth transition for image loading
      }}
    >
      {/* Gradient Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      <div className="relative z-10 p-8 md:p-16 max-w-lg mx-auto rounded-3xl shadow-2xl bg-white bg-opacity-70">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 transform transition-transform duration-300 hover:scale-105">
          Get in Touch
        </h2>
        <p className="text-gray-800 mb-6 leading-relaxed text-lg">
          Have any questions, suggestions, or feedback? We’d love to hear from
          you! Reach out to us via email and we’ll get back to you as soon as
          possible.
        </p>
        <a
          href="mailto:contact@lebentest.online"
          className="block text-black-700 font-bold text-center hover:text-black-800 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-8"
        >
          contact@einburgerungstest.online
        </a>
        <p className="text-xs text-gray-600">
          Typical response time: 24 hours. Your feedback helps us improve and
          serve you better.
        </p>
      </div>
    </div>
  );
};

export default Contact;

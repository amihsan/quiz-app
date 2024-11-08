// src/components/Contact.js
import React from "react";
import backgroundImage from "../assets/background.jpg"; // Your local background image

const Contact = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center-"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="relative z-10 p-8 md:p-16 max-w-lg mx-auto rounded-3xl shadow-2xl bg-white bg-opacity-70">
        <h2 className="text-3xl text-indigo-800 font-bold mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Have any questions, suggestions, or feedback? We’d love to hear from
          you! Reach out to us via email and we’ll get back to you as soon as
          possible.
        </p>
        <a
          href="mailto:contact@lebentest.online"
          className="text-black-700 font-bold hover:text-black-800 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-block mb-8"
        >
          contact@lebentest.online
        </a>
        <p className="text-sm text-gray-500">
          Typical response time: 24 hours. Your feedback helps us improve and
          serve you better.
        </p>
      </div>
    </div>
  );
};

export default Contact;

import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl text-indigo-700 font-semibold mb-4">
          Contact Us
        </h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or feedback, feel free to reach out to us
          at:
        </p>
        <a
          href="mailto:contact@einbürgerungstest.online"
          className="text-blue-500 font-semibold hover:underline block mb-6"
        >
          contact@lebentest.online
        </a>
        <p className="text-sm text-gray-500">
          We typically respond within 24 hours. Your feedback is valuable to us.
        </p>
      </div>
    </div>
  );
};

export default Contact;

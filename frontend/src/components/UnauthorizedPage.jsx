import React from "react";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        403 - Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <a
        href="/"
        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-colors"
      >
        Go back to Home
      </a>
    </div>
  );
};

export default UnauthorizedPage;

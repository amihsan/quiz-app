// src/components/ProfileActions.js
import React from "react";
import { FiEdit } from "react-icons/fi";

const ProfileActions = ({ onEdit, onClose }) => {
  return (
    <div className="flex justify-between mt-2">
      <button
        onClick={onEdit}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none"
      >
        <FiEdit className="inline mr-2" /> Edit Profile
      </button>
      <button
        onClick={onClose}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
      >
        Close
      </button>
    </div>
  );
};

export default ProfileActions;

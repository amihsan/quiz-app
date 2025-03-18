// src/components/ProfileForm.jsx
import React, { useState } from "react";
import Avatar from "react-avatar";
import { uploadAvatar } from "../api.jsx";
import { FaCheck, FaTimes } from "react-icons/fa";

const ProfileForm = ({ userData, onUpdate, onCancel }) => {
  const [updatedData, setUpdatedData] = useState(userData);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userData.avatar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the field is nested (e.g., address.street)
    if (name.includes(".")) {
      const [parentField, childField] = name.split(".");
      setUpdatedData((prevData) => ({
        ...prevData,
        [parentField]: {
          ...prevData[parentField],
          [childField]: value,
        },
      }));
    } else {
      // If the field is not nested
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (avatarFile) {
        const avatarPath = await uploadAvatar(avatarFile);
        setUpdatedData((prevData) => ({
          ...prevData,
          avatar: avatarPath,
        }));
      }
      onUpdate(updatedData);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  return (
    <div className="mx-auto bg-gray rounded-md shadow-lg p-8 overflow-hidden w-full ">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-600">
        Update Profile
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Avatar upload input */}
        <div className="mb-6 flex flex-col items-center">
          <label
            htmlFor="avatar"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Profile Picture:
          </label>
          <div className="mb-4">
            <Avatar
              name={userData.username}
              round={true}
              size={150}
              src={avatarPreview || userData.avatar}
            />
          </div>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        {/* Input fields for editing profile information */}
        {/* Username input */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={updatedData.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        {/* First Name and Last Name input */}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={updatedData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={updatedData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        {/* Email input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        {/* Address inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="street"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Street:
            </label>
            <input
              type="text"
              id="street"
              name="address.street"
              value={updatedData.address.street}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Street"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="houseRoom"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              House / Room:
            </label>
            <input
              type="text"
              id="houseRoom"
              name="address.houseRoom"
              value={updatedData.address.houseRoom}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="House / Room"
            />
          </div>
        </div>
        {/* Address inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="postalCode"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Postal Code:
            </label>
            <input
              type="text"
              id="postalCode"
              name="address.postalCode"
              value={updatedData.address.postalCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="city"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              City:
            </label>
            <input
              type="text"
              id="city"
              name="address.city"
              value={updatedData.address.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        {/* Address inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="state"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              State:
            </label>
            <input
              type="text"
              id="state"
              name="address.state"
              value={updatedData.address.state}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="country"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="address.country"
              value={updatedData.address.country}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        {/* Phone number inputs */}
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="text-lg font-semibold text-gray-800 mb-2"
          >
            Phone Number:
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={updatedData.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit and cancel buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none"
          >
            <FaCheck className="inline mr-2" /> Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
          >
            <FaTimes className="inline mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;

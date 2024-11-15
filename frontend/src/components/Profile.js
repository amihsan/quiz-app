// src/components/Profile.js
import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadAvatar } from "../api";
import ProfileForm from "./ProfileForm";
import ProfileInfo from "./ProfileInfo";
import ProfileActions from "./ProfileActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await getProfile();
      setUserData(response);
      setIsLoading(false);
      setError("");
    } catch (error) {
      setError("Error fetching profile data.");
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    navigate("/"); // Navigate to the Home page
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      setIsEditing(false);
      setError("");
      fetchProfileData();
    } catch (error) {
      setError("Error updating profile data.");
    }
  };

  const handleAvatarUpload = async (avatarFile) => {
    try {
      const avatarPath = await uploadAvatar(avatarFile);
      const updatedUserData = { ...userData, avatar_url: avatarPath };
      setUserData(updatedUserData);
      return avatarPath;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isLoading ? (
        <div className="flex items-center bg-white rounded-lg p-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="mr-4 text-indigo-600"
          />
          <span className="text-lg font-semibold">Loading ...</span>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-md shadow-lg w-full ">
          {!isEditing && (
            <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">
              Profile
            </h2>
          )}
          {userData ? (
            <>
              {isEditing ? (
                <ProfileForm
                  userData={userData}
                  onUpdate={handleUpdate}
                  onCancel={handleCancelEdit}
                  onAvatarUpload={handleAvatarUpload}
                />
              ) : (
                <>
                  <ProfileInfo userData={userData} />
                  <ProfileActions onEdit={handleEdit} onClose={handleClose} />
                </>
              )}
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

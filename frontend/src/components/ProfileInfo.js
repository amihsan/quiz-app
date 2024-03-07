// src/components/ProfileInfo.js
import React from "react";
import Avatar from "react-avatar";
import { FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfileInfo = ({ userData }) => {
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate("/reset-password");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {userData.avatar_url && (
          <div className="col-span-2 md:col-span-1 flex justify-center">
            <Avatar
              name={userData.username}
              src={`${userData.avatar_url}?${Date.now()}`}
              round={true}
              size={200}
            />
          </div>
        )}

        <div className="col-span-2 md:col-span-1">
          {userData.firstName && userData.lastName && (
            <InfoItem
              label="Name:"
              value={`${userData.firstName} ${userData.lastName}`}
            />
          )}
          {<InfoItem label="Username:" value={userData.username} />}
          {<InfoItem label="Email:" value={userData.email} />}
          {userData.phoneNumber && (
            <InfoItem label="Mobile:" value={userData.phoneNumber} />
          )}
        </div>

        {userData.address && (
          <div className="col-span-2">
            <AddressInfo address={userData.address} />
          </div>
        )}
      </div>

      <div className="flex justify-end items-center">
        <button
          onClick={handleChangePassword}
          className="flex items-center bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          <FiLock className="inline mr-2" />
          Change Password
        </button>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="mb-4 ml-2">
    <h3 className="mr-2 font-semibold">{label}</h3>
    <p className="text-indigo-700">{value}</p>
  </div>
);

const AddressInfo = ({ address }) => {
  if (!address || Object.values(address).every((value) => !value)) {
    // If address object is empty or all properties are empty, don't render
    return null;
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold">Address:</h3>
      <p className="text-indigo-700">
        {address.street && `${address.street}, `}
        {address.houseRoom && `${address.houseRoom}, `}
        {address.postalCode && `${address.postalCode}, `}
        {address.city && `${address.city}, `}
        {address.state && `${address.state}, `}
        {address.country && `${address.country}`}
      </p>
    </div>
  );
};

export default ProfileInfo;

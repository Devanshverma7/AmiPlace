import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const userData = useSelector((store) => store.userDetails.userData);
  const imgPath = userData.avatarURL;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Menu button */}
      <button className="px-2 focus:outline-none mt-1" onClick={toggleDrawer}>
        {imgPath ? (
          <img
            src={imgPath}
            alt=""
            className="user-image-sidedrawer rounded-full w-9 border-2 border-blue-300"
          />
        ) : (
          <div>Set Up Profile</div>
        )}
      </button>

      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } bg-white shadow-lg flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-300">
          <div className="text-lg font-semibold text-gray-800">Menu</div>
          <button onClick={toggleDrawer}>
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 border-b border-gray-300">
          <Link
            to="/profile"
            className="text-gray-800 text-base focus:outline-none w-full text-left block"
          >
            User Profile
          </Link>
        </div>
        {/* <div className="p-4 border-b border-gray-300">
          <Link
            to="/AccountVerification"
            className="text-gray-800 text-base focus:outline-none w-full text-left block"
          >
            Verify your account
          </Link>
        </div> */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="text-gray-800 text-base focus:outline-none w-full text-left"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {isOpen && (
        <div
          className=" fixed inset-0 bg-black opacity-50"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default SideDrawer;

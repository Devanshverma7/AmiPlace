import React from "react";
import Info_fill from "./Info_fill";
import UserBasicInfo from "./UserBasicInfo";
import UserAvatar from "./UserAvatar";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const Display_profile = () => {
  return (
    <div className="relative bg-slate-200 w-full min-h-screen md:p-5 overflow-y-auto">
      {/* Back to Dashboard Button */}
      <div className="absolute top-5 left-5 z-10">
        <Link to="/dashboard">
          <button className="bg-gray-400 flex items-center space-x-1 text-white px-3 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300">
            <IoChevronBack className="text-lg" />
            <span>Community</span>
          </button>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center pt-16 md:pt-5">
        {/* User Basic Data */}
        <div className="bg-white w-full max-w-4xl lg:max-w-[70%] rounded-xl shadow-md overflow-hidden mb-10 border border-blue-200">
          <div className="flex flex-col md:flex-row p-5 gap-5">
            <UserAvatar />
            <UserBasicInfo />
          </div>
        </div>

        {/* Info Fill Section */}
        <div className="w-full max-w-4xl lg:max-w-[70%] ">
          <Info_fill />
        </div>
      </div>
    </div>
  );
};

export default Display_profile;

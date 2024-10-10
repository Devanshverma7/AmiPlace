import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PlusCircle } from "lucide-react";
import CreateJobPost from "./CreateJobPost";
import JobsList from "./JobsList";
import SearchJobPost from "./SearchJobPost";

const CampusPlacements = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filter, setFilter] = useState("All");
  const { userType } = useSelector((store) => store.userDetails.userData);

  const handleForm = () => {
    setIsFormVisible(!isFormVisible);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Campus Placements</h1>

      <div className="mb-8">
        <SearchJobPost />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          {["All", "Currently Opened", "Upcoming", "Closed"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === option
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {userType === "Admin" && (
          <button
            onClick={handleForm}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Job
          </button>
        )}
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <CreateJobPost onClose={() => setIsFormVisible(false)} jobId={""} />
          </div>
        </div>
      )}

      <JobsList filter={filter} />
    </div>
  );
};

export default CampusPlacements;

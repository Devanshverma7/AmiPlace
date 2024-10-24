import { Link } from "react-router-dom";
import { IoConstructOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const JobsDropDown = ({ isOpen }) => {
  if (!isOpen) return null;
  const userData = useSelector((store) => store.userDetails.userData);
  const userType = userData.userType;

  return (
    <div className="jobs-drop-down text-sm bg-gray-50 border-x border-b border-gray-400 w-48 flex flex-col">
      <Link
        to="/CampusPlacements"
        className="px-4 py-5 hover:bg-gray-200 border-b"
      >
        Campus Placements
      </Link>
      {userType === "Admin" && (
        <Link to="/UserList" className="px-4 py-5 hover:bg-gray-200 border-b">
          Filter students
        </Link>
      )}
      <span className="flex gap-2 px-4 py-5 text-gray-400 cursor-not-allowed hover:bg-gray-00">
        Referrals
        <IoConstructOutline className="mt-1" />
      </span>
    </div>
  );
};

export default JobsDropDown;

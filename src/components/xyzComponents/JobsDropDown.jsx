import { Link } from "react-router-dom";
import { IoConstructOutline } from "react-icons/io5";

const JobsDropDown = ({ isOpen }) => {
  return (
    <div
      className={`jobs-drop-down text-sm bg-gray-50 border-x-2 border-b-2 border-gray-300 w-[12%] fixed top-[8.7%] right-[38%]  flex flex-col  ${
        !isOpen && "hidden"
      }`}
    >
      <Link to="/CampusPlacements" className="px-4 py-5">
        Campus Placements
      </Link>
      <span className="flex gap-2 px-4 pb-5 text-gray-500 cursor-not-allowed">
        Referrals
        <IoConstructOutline className="mt-1" />
      </span>
    </div>
  );
};
export default JobsDropDown;

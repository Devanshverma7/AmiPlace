import { useLocation, useNavigate } from "react-router-dom";
import LikedByUser from "./LikedByUser";
import { RxCross1 } from "react-icons/rx";

const LikedByList = () => {
  const location = useLocation();
  const likedBy = location.state.likedBy;
  const navigate = useNavigate();

  const handleCrossClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto p-4">
      {/* Header with cross button */}
      <div className="flex justify-between items-center relative">
        <p className="text-lg font-semibold">Post liked by: </p>
        {/* Cross button positioned in the top-right for larger screens */}
        <RxCross1
          className="cursor-pointer text-xl absolute right-0 top-0 md:relative"
          onClick={handleCrossClick}
        />
      </div>

      {/* List of users who liked the post */}
      {likedBy.likedByUsers.map((user, userIndex) => (
        <LikedByUser
          key={userIndex}
          userUID={user}
          currentUser={likedBy.userDataUserName}
        />
      ))}
    </div>
  );
};

export default LikedByList;

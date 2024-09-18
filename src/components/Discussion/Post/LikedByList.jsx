import { useLocation } from "react-router-dom";
import LikedByUser from "./LikedByUser";

const LikedByList = () => {
  const location = useLocation();
  const likedBy = location.state.likedBy;

  return (
    <>
      <p className="text-lg font-semibold">Post liked by: </p>
      {likedBy.likedByUsers.map((user, userIndex) => (
        <LikedByUser
          userUID={user}
          currentUser={likedBy.userDataUserName}
        />
      ))}
    </>
  );
};
export default LikedByList;

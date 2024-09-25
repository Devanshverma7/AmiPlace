import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPostActions } from "../../../store/createPostSlice";
import PopUpModal from "../../PopUpModal";
import Lottie from "lottie-react";
import User_Icon from "../../../assest/user_Icon.json";

const CreatePostIcon = () => {
  const dispatch = useDispatch();

  const handleCreatePost = () => {
    dispatch(createPostActions.createPost());
  };

  const userData = useSelector((store) => store.userDetails.userData);
  const imgPath = userData.avatarURL;
  const userName = userData.username;

  return (
    <div className="createPostContainer border-b-[1px]  border-b-gray-300 flex items-center justify-center space-x-3 py-7 px-1  sticky top-16 z-20 bg-white rounded-t-md">
      <Link to="/profile" className="profileImg">
        {imgPath ? (
          <img
            className="rounded-full w-12 h-12 border-[3px] border-green-600"
            src={`${imgPath}`}
            alt="your_pic"
          />
        ) : (
          <Lottie className="w-10 border-2 border-blue-400 p-1 rounded-full" animationData={User_Icon} loop={true} />
        )}
      </Link>
      <div
        className="inputContent border-[1px] border-solid border-gray-300 px-4 py-2 w-[70%] cursor-pointer rounded-sm"
        onClick={handleCreatePost}
      >
        <p className="text-[#a5a5a5]">Post as {`"${userName}"`}</p>
      </div>
      {!userName && <PopUpModal />}
    </div>
  );
};
export default CreatePostIcon;

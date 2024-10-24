import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createPostActions } from "../../../store/createPostSlice";
import Lottie from "lottie-react";
import User_Icon from "../../../assest/user_Icon.json";
import { useState } from "react";
import PopUpModal from "../../xyzComponents/PopUpModal";

const CreatePostIcon = () => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userDetails.userData);
  const imgPath = userData.avatarURL;
  const userName = userData.username;
  const [stopPosting, setStopPosting] = useState(false);

  const popUpMessage1 = (
    <span className="text-yellow-600">
      Set your username first without that you cannot interact in community!
      <Link to="/profile" className="ml-3 text-purple-400 underline">
        Click here
      </Link>
    </span>
  );
  const popUpMessage2 = (
    <span className="text-yellow-600">
      Attention!!!
      <br /> Student you are requested to kindly set up your profile with all
      details! as we the developers will be incorporating algorithms to suggest
      students names to CRC as per there skillset for internship & placement
      opportunities!.
      <Link to="/profile" className="ml-3 text-purple-400 underline">
        Click here
      </Link>{" "}
      to setup your profile
    </span>
  );
  const popUpMessage3 = (
    <span className="text-red-600">
      You cannot post without username!. Kindly set username in profile section
      <Link to="/profile" className="ml-3 text-purple-400 underline">
        Click here
      </Link>
    </span>
  );

  const handleCreatePost = () => {
    if (userName) {
      dispatch(createPostActions.createPost());
    } else {
      setStopPosting(true);
      setTimeout(() => {
        setStopPosting(false);
      }, 10000);
    }
  };

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
          <Lottie
            className="w-10 border-2 border-blue-400 p-1 rounded-full"
            animationData={User_Icon}
            loop={true}
          />
        )}
      </Link>
      <div
        className="inputContent border-[1px] border-solid border-gray-300 px-4 py-2 w-[70%] cursor-pointer rounded-sm"
        onClick={handleCreatePost}
      >
        <p className="text-[#a5a5a5]">Post as {`"${userName}"`}</p>
      </div>
      {!userName && (
        <PopUpModal
          popUpMessage={popUpMessage1}
          position={"top-[27%]"}
          intensity={"bg-yellow-200 border-yellow-300"}
        />
      )}
      {stopPosting && (
        <PopUpModal
          popUpMessage={popUpMessage3}
          position={"top-[27%]"}
          intensity={"bg-red-200 border-red-300"}
        />
      )}
      {(!userData.FullName || !userData.skills) && (
        <PopUpModal
          popUpMessage={popUpMessage2}
          position={"top-[40%]"}
          intensity={"bg-yellow-200 border-yellow-300"}
        />
      )}
    </div>
  );
};
export default CreatePostIcon;

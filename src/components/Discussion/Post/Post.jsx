import React, { useEffect, useRef, useState } from "react";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsReply, BsThreeDots } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { postsAction } from "../../../store/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import PostOverlay from "./PostOverlay";
import { auth, db } from "../../../firebase.config";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import LoadingCool2 from "../../LoadingCool2";
import { Link } from "react-router-dom";

const Post = React.forwardRef(({ postData, isOverlay }, ref) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userDetails.userData);
  const userDataUserName = userData.username;
  const [localLiked, setLocalLiked] = useState(
    postData.likedBy.hasOwnProperty(auth.currentUser.uid)
  );
  const [threeDots, setThreeDots] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [yearInfo, setYearInfo] = useState("");
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [likes, setLikes] = useState(postData.likes);
  const [postImage, setPostImage] = useState("");
  const [postDeleted, setPostDeleted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [sound] = useSound("src/Media/multi-pop-1-188165.mp3", {
    volume: 0.2,
  });
  const likedByPeople = Object.keys(postData.likedBy);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", postData.user);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserName(data.username);
        setUserImage(data.avatarURL);
        setYearInfo(data.Semister + " " + data.Branch);
      }
    };
    fetchUserData();

    const fetchPostImage = async () => {
      if (postData.postImage) {
        setImageLoading(true);
        try {
          setPostImage(postData.postImage);
        } catch (error) {
          console.error("Error setting image:", error);
          setPostImage(null);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      }
    };
    fetchPostImage();
  }, [postData.user, postData.postImage]);

  const handleThreeDots = () => {
    setThreeDots(!threeDots);
  };

  const handleLike = async () => {
    const userUid = auth.currentUser.uid;
    const newLikeState = !localLiked;
    setLocalLiked(newLikeState);
    if (newLikeState) {
      sound();
      setLikes(likes + 1);
    } else {
      setLikes(likes - 1);
    }
    dispatch(
      postsAction.Liked({
        postId: postData.id,
        like: newLikeState,
        liker: userUid,
      })
    );
    try {
      const postRef = doc(db, "post", postData.id);
      const postSnapshot = await getDoc(postRef);
      const _postData = postSnapshot.data();
      let updatedLikes = _postData.likes;
      let _likedBy = { ..._postData.likedBy };

      const userAlreadyLiked = _likedBy[userUid];

      if (newLikeState && !userAlreadyLiked) {
        updatedLikes += 1;
        _likedBy[userUid] = true;

        if (_postData.user !== userUid) {
          const notificationRef = collection(db, "notifications");
          await addDoc(notificationRef, {
            type: "like",
            senderId: userUid,
            senderName: userData.username,
            recipientId: _postData.user,
            postId: postData.id,
            content:
              _postData.content.substring(0, 50) +
              (_postData.content.length > 50 ? "..." : ""),
            createdAt: serverTimestamp(),
          });
        }
      } else if (!newLikeState && userAlreadyLiked) {
        updatedLikes -= 1;
        delete _likedBy[userUid];
      }

      await updateDoc(postRef, {
        likes: updatedLikes,
        likedBy: _likedBy,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteDoc(doc(db, "post", postData.id));
      setPostDeleted(true);
    } catch (error) {
      console.error("Error removing document: ", error);
    }
    setThreeDots(false);
  };

  function getTimeDifference(timestamp) {
    const now = new Date().getTime();
    let postTime;

    if (typeof timestamp === "string") {
      postTime = new Date(timestamp).getTime();
    } else if (timestamp && typeof timestamp.toDate === "function") {
      postTime = timestamp.toDate().getTime();
    } else {
      return "0m";
    }
    const diffTime = now - postTime;
    const minutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  function formatLikeCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return count.toString();
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setThreeDots(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative postContainer px-5 border-b-[1px] border-gray-300 md:hover:bg-gray-100 min-h-10 bg-white"
    >
      {postDeleted ? (
        <p> Post deleted successfully!</p>
      ) : (
        <>
          <div className="postHeader flex justify-between">
            <Link
              to={`${
                userName == userDataUserName
                  ? "/profile"
                  : "/DisplayOnlyProfile"
              }`}
              state={{ user: userName }}
              className="userInfo flex space-x-2 my-2 "
            >
              <img
                src={userImage}
                alt="user_ki_photu"
                className="rounded-full w-8 h-8 ml-2 mt-2 border-[0.5px]"
              />
              <div className="userName mt-2 flex gap-2">
                <div className="flex">
                  <span className="text-base font-medium opacity-70">
                    {userName}
                  </span>
                  {(userName === "devanshVerma" ||
                    userName === "praharshsingh07" ||
                    userName === "Anush29") && (
                    <MdVerified className="mt-[5.2px] ml-1 text-base text-blue-500" />
                  )}
                </div>
                <span className="yearInfo opacity-60 text-sm mt-[3px]">
                  {" "}
                  ~ sem {yearInfo} {}
                </span>
              </div>
            </Link>
            <div className=" mt-4 flex space-x-1 opacity-55">
              <span className="addedTimeAgo text-sm mt-1">
                {getTimeDifference(postData.createdAt)}{" "}
              </span>
              <div
                className={`postSettings rounded-full h-7 p-1 hover:bg-white ${
                  userName != userDataUserName && "hidden"
                }`}
                onClick={() => handleThreeDots()}
              >
                <BsThreeDots className="text-xl" />
              </div>
            </div>
          </div>

          {/* Post Dropdown Settings */}
          <div
            ref={dropdownRef}
            className={`absolute top-10 right-3 z-10 mt-2 w-28 md:w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
              threeDots ? "block" : "hidden"
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            <div className="py-1" role="none">
              <div
                className="text-red-600 block w-full px-4 py-2 text-sm hover:bg-slate-200"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-0"
                onClick={handleDeletePost}
              >
                Delete Post
              </div>
            </div>
          </div>
          <p className="content border-l-2 border-gray-400 pl-3 mb-3 mx-6 py-0 overflow-hidden">
            {postData.content}
          </p>
          {imageLoading ? (
            <div className="mb-4 ml-8">
              <LoadingCool2 />
            </div>
          ) : postImage ? (
            <div className="mb-4 border-[1px] border-gray-500 w-fit ml-8">
              <img
                src={postImage}
                alt="Post image"
                className="max-w-lg max-h-80"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  setImageError(true);
                }}
              />
            </div>
          ) : imageError ? (
            <div>Error loading image</div>
          ) : (
            <div></div>
          )}
          <div className="recations flex space-x-10">
            <div className="like ml-5 flex space-x-1 mb-3">
              {localLiked === false ? (
                <FcLikePlaceholder
                  className="text-2xl"
                  onClick={() => handleLike()}
                />
              ) : (
                <FcLike className="text-2xl" onClick={() => handleLike()} />
              )}
              <Link
                to="/LikedByList"
                state={{
                  likedBy: {
                    likedByUsers: likedByPeople,
                    userDataUserName: userDataUserName,
                  },
                }}
                className="likesCount text-sm text-gray-500 mt-[2px]"
              >
                {formatLikeCount(likes)}
                {`${likes < 2 ? " Reaction" : " Reactions"}`}
              </Link>
            </div>
            <div
              className="comment flex space-x-1 cursor-pointer p-0 hover:text-blue-500 mb-1"
              onClick={() => setIsPostClicked(true)}
            >
              <BsReply className="opacity-55 text-xl" />
              <span className="mt-[1px] text-sm text-gray-500 hover:text-blue-600 font-normal">
                Reply
              </span>
            </div>
          </div>
        </>
      )}
      {isOverlay && (
        <PostOverlay
          isOpen={isPostClicked}
          onClose={() => setIsPostClicked(!isPostClicked)}
          postData={{ ...postData, postImage: postImage }}
        />
      )}
    </div>
  );
});

export default Post;

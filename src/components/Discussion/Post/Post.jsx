import React, { useEffect, useRef, useState } from "react";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsReply, BsThreeDots } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { postsAction } from "../../../store/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import PostOverlay from "./PostOverlay";
import { PiCodeDuotone } from "react-icons/pi";
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
import { Link } from "react-router-dom";

const Post = React.forwardRef(({ postData, isOverlay }, ref) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userDetails.userData);
  const userDataUserName = userData.username;
  const [localLiked, setLocalLiked] = useState(
    postData.likedBy.hasOwnProperty(auth.currentUser.uid)
  );
  const [threeDots, setThreeDots] = useState(false);
  const [isPostClicked, setIsPostClicked] = useState(false);
  const [likes, setLikes] = useState(postData.likes);
  const [postDeleted, setPostDeleted] = useState(false);
  const postTextContent = postData.content.replace(/\n/g, "<br>");
  const [sound] = useSound("src/Media/multi-pop-1-188165.mp3", {
    volume: 0.2,
  });
  const likedByPeople = Object.keys(postData.likedBy);
  const dropdownRef = useRef(null);

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
    if (auth.currentUser.uid === postData.user) {
      if (
        window.confirm(
          "You cannot get this post back after deletion, are you sure you want to delete this post?"
        )
      ) {
        try {
          await deleteDoc(doc(db, "post", postData.id));
          setPostDeleted(true);
        } catch (error) {
          console.error("Error removing document: ", error);
        }
      }
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
                postData.userName == userDataUserName
                  ? "/profile"
                  : "/DisplayOnlyProfile"
              }`}
              state={{ user: postData.userName }}
              className="userInfo flex space-x-2 my-2 "
            >
              <img
                src={postData.userImage}
                alt="user_ki_photu"
                className="rounded-full w-8 h-8 ml-2 mt-2 border-[0.5px]"
              />
              <div className="userName mt-3 flex gap-2">
                <div className="flex">
                  <span className="text-base font-medium opacity-70">
                    {postData.userName}
                  </span>
                  {postData.verified && (
                    <>
                      {postData.dev && (
                        <span className=" mt-[5px] mx-1">
                          <PiCodeDuotone className="text-lg font-semibold" />
                        </span>
                      )}
                      <MdVerified className="mt-[5.3px] ml-[2px] text-[15px] text-blue-500" />
                    </>
                  )}
                </div>
                <span className="yearInfo opacity-60 text-sm mt-[3px]">
                  {" "}
                  ~ sem {postData.yearInfo} {}
                </span>
              </div>
            </Link>
            <div className=" mt-4 flex space-x-1 opacity-55">
              <span className="addedTimeAgo text-sm mt-1">
                {getTimeDifference(postData.createdAt)}{" "}
              </span>
              <div
                className={`postSettings rounded-full h-7 p-1 hover:bg-white ${
                  postData.userName != userDataUserName && "hidden"
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
          <p
            className="content border-l-2 border-gray-300 pl-3 mb-3 mx-6 py-0 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: postTextContent }}
          ></p>
          {postData.postImage ? (
            <div className="mb-4 border-[1px] border-gray-500 w-fit ml-8">
              <img
                src={postData.postImage}
                alt="Post image"
                className="md:max-w-lg max-h-80"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  setImageError(true);
                }}
              />
            </div>
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
              <div>
                <Link
                  to="/LikedByList"
                  state={{
                    likedBy: {
                      likedByUsers: likedByPeople,
                      userDataUserName: userDataUserName,
                    },
                  }}
                  className="group relative likesCount text-sm text-gray-500 mt-[2px]"
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    See people who reacted
                  </div>
                  {formatLikeCount(likes)}
                  {`${likes < 2 ? " Reaction" : " Reactions"}`}
                </Link>
              </div>
            </div>
            <div
              className="comment flex space-x-1 cursor-pointer p-0 hover:text-blue-500 mb-1"
              onClick={() => setIsPostClicked(true)}
            >
              <BsReply className="text-xl" />
              <span className=" text-sm text-gray-500 mt-[1px]">
                {postData.comments.length}
              </span>
              <span className="mt-[1px] text-sm text-gray-500 font-normal">
                {postData.comments.length > 1 ? "Replies" : "Reply"}
              </span>
            </div>
          </div>
        </>
      )}
      {isOverlay && (
        <PostOverlay
          isOpen={isPostClicked}
          onClose={() => setIsPostClicked(!isPostClicked)}
          postData={postData}
        />
      )}
    </div>
  );
});

export default Post;

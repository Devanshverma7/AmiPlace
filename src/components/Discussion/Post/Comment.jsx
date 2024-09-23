import { useState, useEffect, useRef, useMemo } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase.config";
import { postsAction } from "../../../store/postsSlice";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";

const Comment = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.userDetails.userData);
  const userDataUserName = userData.username;
  const [threeDots, setThreeDots] = useState(false);
  const [upVoted, setUpvoted] = useState(
    comment.upVotedBy?.hasOwnProperty(auth.currentUser.uid) || false
  );
  const [upVotes, setUpvotes] = useState(comment.upVotes || 0);
  const dropdownRef = useRef(null);

  const memoizedUserData = useMemo(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", comment.user);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          verified: data.Verified,
          userName: data.username,
          userImage: data.avatarURL,
          yearInfo: data.Semester + " " + data.Branch,
        };
      }
      return null;
    };
    return fetchUserData();
  }, [comment.user]);

  const [userInfo, setUserInfo] = useState({
    verified: false,
    userName: "",
    userImage: "",
    yearInfo: "",
  });

  useEffect(() => {
    memoizedUserData.then((data) => {
      if (data) {
        setUserInfo(data);
      }
    });
  }, [memoizedUserData]);

  const handleThreeDots = () => {
    setThreeDots(!threeDots);
  };

  const handleDeleteComment = async () => {
    try {
      const postRef = doc(db, "post", postId);
      const postSnapshot = await getDoc(postRef);

      const commentQuery = postSnapshot
        .data()
        .comments.find((com) => com.id == comment.id);
      if (commentQuery) {
        updateDoc(postRef, {
          comments: arrayRemove(commentQuery),
        }).catch((error) => {
          console.error("Error deleting comment: ", error);
        });
      } else {
        console.log("Comment not found");
      }
      dispatch(postsAction.deleteComment({ postId: postId, id: comment.id }));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
    handleThreeDots();
  };

  const handleUpvote = async () => {
    const userUid = auth.currentUser.uid;
    const newUpvoteState = !upVoted;
    setUpvoted(newUpvoteState);

    const newUpvotes = newUpvoteState ? upVotes + 1 : upVotes - 1;
    setUpvotes(newUpvotes);

    dispatch(
      postsAction.upVotedComment({
        postId: postId,
        commentId: comment.id,
        upVoted: newUpvoteState,
        upVoter: userUid,
      })
    );

    try {
      const postRef = doc(db, "post", postId);
      const postSnapshot = await getDoc(postRef);
      const postData = postSnapshot.data();
      const updatedComments = postData.comments.map((c) => {
        if (c.id === comment.id) {
          let updatedUpVotedBy = { ...(c.upVotedBy || {}) };

          if (newUpvoteState) {
            updatedUpVotedBy[userUid] = true;
          } else {
            delete updatedUpVotedBy[userUid];
          }

          return { ...c, upVotes: newUpvotes, upVotedBy: updatedUpVotedBy };
        }
        return c;
      });

      await updateDoc(postRef, { comments: updatedComments });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  function getTimeDifference(timestamp) {
    const now = new Date().getTime();
    const postTime = timestamp;
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
    <div className="relative comment bg-gray-100 w-full border-b-[1px] border-b-gray-400">
      <div className="userInfo space-x-2 flex justify-between pt-2">
        <div className="userName flex gap-2">
          <img
            src={userInfo.userImage}
            alt="user_ki_photu"
            className="rounded-full w-8 h-8 ml-2 mt-2"
          />
          <Link
            to={`${
              userInfo.userName == userDataUserName
                ? "/profile"
                : "/DisplayOnlyProfile"
            }`}
            state={{ user: userInfo.userName }}
            className="text-base font-medium  mt-2 flex"
          >
            <span className="opacity-70">{userInfo.userName}</span>
            {userInfo.verified && (
              <MdVerified className="mt-[6.5px] ml-[2px] text-sm text-blue-500" />
            )}
          </Link>
          <span className="yearInfo opacity-60 text-sm mt-[10px]">
            ~ sem {userInfo.yearInfo}
          </span>
        </div>
        <div className="flex opacity-55 space-x-1 pr-4">
          <span className="addedTimeAgo text-sm mt-1">
            {getTimeDifference(comment.createdAt)}{" "}
          </span>
          <div
            className={`postSettings rounded-full h-7 p-1 hover:bg-white ${
              userInfo.userName !== userDataUserName && "hidden"
            }`}
            onClick={handleThreeDots}
          >
            <BsThreeDots className="text-xl" />
          </div>
        </div>
      </div>
      <div
        ref={dropdownRef}
        className={`absolute top-5 right-3 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          threeDots ? "block" : "hidden"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-1" role="none">
          <div
            className="text-red-600 block cursor-pointer w-full px-4 py-1 text-sm hover:bg-slate-200"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
            onClick={handleDeleteComment}
          >
            Delete
          </div>
        </div>
      </div>
      <p className="comment-content opacity-85 ml-12 pb-3  mr-8 pr-0 ">
        {comment.commentContent}
        <img
          src={comment.commentImg}
          alt=""
          className={`${!comment.commentImg && "hidden"} w-48`}
        />
      </p>
      <div className="upVote flex justify-end">
        <div className="flex mr-5 mb-2">
          <span className="text-sm mr-1">Upvote </span>
          {upVoted ? (
            <BiSolidUpvote
              onClick={handleUpvote}
              className="text-lg cursor-pointer"
            />
          ) : (
            <BiUpvote
              onClick={handleUpvote}
              className="text-lg cursor-pointer"
            />
          )}
          <span className="text-sm">{upVotes}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;

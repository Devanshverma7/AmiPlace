import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase.config";

const LikedByUser = ({ userUID, currentUser }) => {
  const [avatarURL, setAvatarURL] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user avatar
        const userDocRef = doc(db, "users", userUID);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.avatarURL) {
            setAvatarURL(userData.avatarURL);
          }
          if (userData.username) {
            setUserName(userData.username);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userUID]);
  // console.log(currentUser);

  return (
    <Link
      to={userName === currentUser ? "/profile" : "/DisplayOnlyProfile"}
      state={{ user: userName }}
      className="flex w-full mx-5 my-1 py-1 space-x-2"
    >
      {avatarURL && (
        <img
          src={avatarURL}
          alt={`${userName}'s avatar`}
          className="user-image-sidedrawer rounded-full w-8 h-8 border-2 border-blue-300"
        />
      )}
      <span className="font-medium text-lg">{userName}</span>
    </Link>
  );
};

export default LikedByUser;

import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import User_Icon from "../../assest/user_Icon.json";

import { db } from "../../firebase.config";

import { doc, getDoc } from "firebase/firestore";
import { MdVerified } from "react-icons/md";

const UserAvatar = ({ userUID }) => {
  const [avatarURL, setAvatarURL] = useState(null);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.avatarURL) {
          setAvatarURL(userData.avatarURL);
        }
        if (userData.username) {
          setUsername(userData.username);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="items-center justify-center w-full h-3/5 sm:w-1/3 md:w-1/3 lg:w-1/3 m-3 rounded-2xl p-4">
      <div className="user_profile_img mb-5">
        {avatarURL ? (
          <img
            src={avatarURL}
            alt="User Avatar"
            className="w-60 h-56 rounded-full object-cover border-4 border-blue-400"
          />
        ) : (
          <Lottie className="h-60 w-60" animationData={User_Icon} loop={true} />
        )}
      </div>
      <span className="text-xl font-semibold mt-2 ml-5 flex">
        ~ {username || "No username set"}
        {(username === "devanshVerma" ||
          username === "praharshsingh07") && (
          <MdVerified className="mt-[7px] ml-1 text-lg text-blue-500" />
        )}
      </span>
    </div>
  );
};

export default UserAvatar;

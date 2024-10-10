import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import User_Icon from "../../assest/user_Icon.json";
import { db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { MdVerified } from "react-icons/md";
import { PiCodeDuotone } from "react-icons/pi";

const UserAvatar = ({ userUID }) => {
  const [avatarURL, setAvatarURL] = useState(null);
  const [verified, setVerified] = useState(false);
  const [dev, setDev] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setVerified(userData.Verified);
        setDev(userData.dev);
        if (userData.avatarURL) {
          setAvatarURL(userData.avatarURL);
        }
        if (userData.username) {
          setUsername(userData.username);
        }
      }
    };

    fetchUserData();
  }, [userUID]);

  return (
    <div className="flex flex-col items-center w-full h-3/5 sm:w-1/3 md:w-1/3 lg:w-1/3 m-3 rounded-2xl p-4">
      <div className="w-full max-w-[240px] aspect-square mb-5 rounded-full overflow-hidden border-4 border-blue-400">
        {avatarURL ? (
          <img
            src={avatarURL}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <Lottie
            className="w-full h-full"
            animationData={User_Icon}
            loop={true}
          />
        )}
      </div>
      <div className="flex items-center justify-center w-full">
        <span className="text-xl font-semibold flex items-center">
          <span className="mr-1">~</span>
          {username || "No username set"}
          {verified && (
            <div className="flex items-center ml-1">
              <MdVerified className="text-[18px] text-blue-500" />
              {dev && <PiCodeDuotone className="text-2xl font-semibold ml-1" />}
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default UserAvatar;

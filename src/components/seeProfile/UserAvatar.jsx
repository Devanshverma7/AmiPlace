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
  }, []);

  return (
    <div className="items-center justify-center w-full h-3/5 sm:w-1/3 md:w-1/3 lg:w-1/3 m-3 rounded-2xl p-4">
      <div className="w-full max-w-[240px] aspect-square mb-5 rounded-full overflow-hidden border-4 border-blue-400 mx-auto">
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
      <span className="text-xl font-semibold mt-2 md:ml-16 ml-20 flex">
        ~ {username || "No username set"}
        {verified && (
          <>
            <MdVerified className="mt-[6px] ml-[2px] text-[18px] text-blue-500" />
            {dev && (
              <span className=" mt-1 mx-1">
                <PiCodeDuotone className="text-2xl font-semibold" />
              </span>
            )}
          </>
        )}
      </span>
    </div>
  );
};

export default UserAvatar;

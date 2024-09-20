import React, { useEffect, useState } from "react";
import Info_fill from "./Info_fill";
import UserBasicInfo from "./UserBasicInfo";
import UserAvatar from "./UserAvatar";
import { db } from "../../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

const DisplayOnlyProfile = () => {
  const location = useLocation();
  const { user } = location.state;
  const [userUID, setUserUID] = useState(null);

  useEffect(() => {
    const fetchUserUID = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", user));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserUID(userDoc.id); // This is the UID
      } else {
        setUserUID(null); // User not found
      }
    };

    fetchUserUID();
  }, [user]);

  // Return null or a loading spinner while fetching userUID
  if (userUID === null) {
    return <div>Loading...</div>;
  }

    return (
      <div className="relative bg-slate-200 w-full min-h-screen p-5 overflow-y-auto">
        {/* Back to Dashboard Button */}
        <div className="absolute top-5 left-5 z-10">
          <Link to="/dashboard">
            <button className="bg-gray-400 flex items-center space-x-1 text-white px-3 py-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300">
              <IoChevronBack className="text-lg" />
              <span>Community</span>
            </button>
          </Link>
        </div>
  
        {/* Main content */}
        <div className="flex flex-col items-center pt-16 md:pt-5">
          {/* User Basic Data */}
          <div className="bg-white w-full max-w-4xl lg:max-w-[70%] rounded-xl shadow-md overflow-hidden mb-10 ml-5 border border-blue-200">
            <div className="flex flex-col md:flex-row p-5 gap-5">
              <UserAvatar userUID={userUID} />
              <UserBasicInfo userUID={userUID} />
            </div>
          </div>
  
          {/* Info Fill Section */}
          <div className="w-full max-w-4xl lg:max-w-[70%] ">
            <Info_fill userUID={userUID} />
          </div>
        </div>
      </div>
    );
};

export default DisplayOnlyProfile;

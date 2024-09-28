import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { BsReply } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { MdVerified } from "react-icons/md";
import { PiCodeDuotone } from "react-icons/pi";

const Notification = ({
  type,
  userName,
  postId,
  content,
  timeAgo,
  notificationId,
  handleSetRefresh,
  senderId,
  recipientId,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for the dropdown menu
  const [recipientData, setRecipientData] = useState({});
  const [senderData, setSenderData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch sender's document
        const senderDocRef = doc(db, "users", senderId);
        const senderDoc = await getDoc(senderDocRef);
        if (senderDoc.exists()) {
          const sData = senderDoc.data();
          setSenderData(sData);
        }

        // Fetch recipient's document
        const recipientDocRef = doc(db, "users", recipientId);
        const recipientDoc = await getDoc(recipientDocRef);
        if (recipientDoc.exists()) {
          const rData = recipientDoc.data();
          setRecipientData(rData); // Add states for recipient data
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchUserData();
  }, [senderId, recipientId]); // Include both senderId and recipientId in the dependency array

  const handleDeleteNotification = async () => {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
      handleSetRefresh();
    } catch (err) {
      console.error(
        "Error deleting notification ",
        notificationId,
        " ",
        content,
        " ",
        err
      );
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Close the menu if click is outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-item p-4 border my-1 rounded-lg border-gray-200 hover:bg-gray-50 relative">
      <div className="flex justify-between">
        <Link
          to="/SeePostFromNotify"
          state={{
            postId: postId,
            recipientData: recipientData,
          }}
          className="flex items-start space-x-3 w-full"
        >
          <div className="flex-shrink-0">
            {type === "like" ? (
              <FcLike className="text-2xl" />
            ) : (
              <BsReply className="text-2xl opacity-55" />
            )}
          </div>
          <div className="flex-grow flex gap-2">
            <img
              src={senderData.avatarURL}
              alt=""
              className="rounded-full mt-2 min-w-8 min-h-8 max-w-8 max-h-8 border border-gray-400"
            />
            <div>
              <div className="flex">
                <span className="font-medium text-base md:text-lg mt-[5px]">
                  {userName}
                </span>
                {senderData.Verified && (
                  <>
                    <MdVerified className="mt-[11px] md:mt-[13.5px] ml-1 text-sm text-blue-500" />
                    {senderData.dev && (
                      <span className="mt-[9px] md:mt-[11px] mx-1">
                        <PiCodeDuotone className="text-lg font-semibold" />
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-sm">
                {type === "like"
                  ? " liked your post"
                  : " commented on your post"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{content}</p>
              <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
            </div>
          </div>
        </Link>

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={toggleMenu}
          >
            <FiMoreVertical className="text-2xl" />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg">
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                onClick={handleDeleteNotification}
              >
                Delete Notification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;

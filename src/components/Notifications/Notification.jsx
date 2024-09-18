import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { BsReply } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

const Notification = ({
  type,
  userName,
  postId,
  content,
  timeAgo,
  notificationId,
  handleSetRefresh,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Reference for the dropdown menu

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
          }}
          className="flex items-start space-x-3"
        >
          <div className="flex-shrink-0">
            {type === "like" ? (
              <FcLike className="text-2xl" />
            ) : (
              <BsReply className="text-2xl opacity-55" />
            )}
          </div>
          <div className="flex-grow">
            <p className="text-sm">
              <span className="font-medium">{userName}</span>
              {type === "like" ? " liked your post" : " commented on your post"}
            </p>
            <p className="text-xs text-gray-500 mt-1">{content}</p>
            <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
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

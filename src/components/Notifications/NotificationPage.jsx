import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import Notification from "./Notification";
import PostFetchingSpinner from "../xyzComponents/PostFetchingSpinner";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleSetRefresh = () => setRefresh(!refresh);

  useEffect(() => {
    const fetchNotifications = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("recipientId", "==", currentUser.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const notificationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort client-side
        notificationsList.sort(
          (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        );

        setNotifications(notificationsList);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(
          "An error occurred while fetching notifications. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [refresh]);

  if (loading) {
    return <PostFetchingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="notification-page container mx-auto max-w-2xl p-2 h-[100vh]">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold my-4">Notifications</h1>
        <Link to="/" className="flex mt-3">
          <IoIosArrowBack className="text-3xl" />{" "}
          <span className="mt-1">Back</span>
        </Link>
      </div>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications yet</p>
      ) : (
        notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            userName={notification.senderName}
            postId={notification.postId}
            content={notification.content}
            timeAgo={notification.createdAt.toDate().toLocaleString()}
            notificationId={notification.id}
            handleSetRefresh={handleSetRefresh}
            senderId={notification.senderId}
            recipientId={notification.recipientId}
          />
        ))
      )}
    </div>
  );
};

export default NotificationPage;

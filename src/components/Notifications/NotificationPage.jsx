import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import Notification from "./Notification";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleSetRefresh = async () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading();
      return;
    }

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const notificationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(
          "An error occurred while fetching notifications. Please try again later."
        );
        setLoading(false);

        // Fallback: fetch without ordering if index error occurs
        if (err.code === "failed-precondition") {
          const fallbackQuery = query(
            notificationsRef,
            where("recipientId", "==", currentUser.uid)
          );
          try {
            const fallbackSnapshot = await getDocs(fallbackQuery);
            const fallbackList = fallbackSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Sort client-side
            fallbackList.sort(
              (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
            );
            setNotifications(fallbackList);
            setError(null);
          } catch (fallbackErr) {
            console.error("Fallback query failed:", fallbackErr);
          }
        }
      }
    };

    fetchNotifications();
  }, [refresh]);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="notification-page container mx-auto max-w-2xl p-2 h-[100vh]">
      <h1 className="text-2xl font-bold my-4">Notifications</h1>
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
          />
        ))
      )}
    </div>
  );
};

export default NotificationPage;

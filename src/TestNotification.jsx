import React, { useState, useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";

const TestNotification = () => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const messaging = getMessaging();
    getToken(messaging, {
      vapidKey:
        "BCDby2xdtMYFnclIiTu96t1yPj39ca-CNxOFamOYrt4nbWsmVUir-bYWczCaCMvemRA2XZ3pW0yG0BmxmQCyuGU",
    })
      .then((currentToken) => {
        if (currentToken) {
          setFcmToken(currentToken);
        } else {
          console.log("No registration token available.");
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }, []);

  const sendTestNotification = async () => {
    if (!fcmToken) {
      console.log("No FCM token available");
      return;
    }

    try {
      const response = await fetch(
        "https://us-central1-amiplace-3c576.cloudfunctions.net/sendTestNotification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: fcmToken,
            title: "Test Notification",
            body: "This is a test notification from FCM!",
          }),
        }
      );

      if (response.ok) {
        console.log("Test notification sent successfully");
      } else {
        console.log("Failed to send test notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  };

  return (
    <div>
      <button
        onClick={sendTestNotification}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send Test Notification
      </button>
    </div>
  );
};

export default TestNotification;

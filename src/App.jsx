import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./components/Auth/Routes";
import { getToken } from "firebase/messaging";
import { AuthProvider } from "./components/Auth/AuthContext";
import LoadingSpinner from "./components/xyzComponents/LoadingSpinner";
import { auth, db, messaging } from "./firebase.config";
import { doc, setDoc } from "firebase/firestore";

// Your VAPID key (this is the same for all users)
const VAPID_KEY =
  "BCDby2xdtMYFnclIiTu96t1yPj39ca-CNxOFamOYrt4nbWsmVUir-bYWczCaCMvemRA2XZ3pW0yG0BmxmQCyuGU";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const addFCMTokenToCurrentUser = (token) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          await setDoc(
            doc(db, "users", userId),
            { fcmToken: token },
            { merge: true }
          );
        } catch (err) {
          console.error("Error associating fcmToken: ", err);
        }
      }
    });
  };
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Generate token using the VAPID key
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        // console.log("FCM token: ", token);
        // Here you can send this token to your Firebase database to associate it with the current user
        // For example:
        addFCMTokenToCurrentUser(token); // You need to implement this
      } else if (permission === "denied") {
        console.log("Notification permission denied");
      }
    } catch (error) {
      console.error("Error generating FCM token:", error);
    }
  };

  useEffect(() => {
    // Request user for notification permission and generate FCM token
    requestPermission();
  }, []);

  useEffect(() => {
    // Simulating a delay to mimic component rendering time
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AuthProvider>
      <Router>{isLoading ? <LoadingSpinner /> : <Routes />}</Router>
    </AuthProvider>
  );
}

export default App;

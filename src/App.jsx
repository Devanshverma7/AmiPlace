import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./components/Auth/Routes";
import { getToken, onMessage } from "firebase/messaging";
import { AuthProvider } from "./components/Auth/AuthContext";
import LoadingSpinner from "./components/xyzComponents/LoadingSpinner";
import { auth, db, messaging } from "./firebase.config";
import { useDispatch } from "react-redux";
import { userDataAction } from "./store/userDetailsSlice";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
// // Your VAPID key (this is the same for all users)
// const VAPID_KEY =
//   "BCDby2xdtMYFnclIiTu96t1yPj39ca-CNxOFamOYrt4nbWsmVUir-bYWczCaCMvemRA2XZ3pW0yG0BmxmQCyuGU";

function App() {
  const [isLoading, setIsLoading] = useState(true);
//   const addFCMTokenToCurrentUser = (token) => {
//     auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         const userId = user.uid;
//         try {
//           await setDoc(
//             doc(db, "users", userId),
//             { fcmToken: token },
//             { merge: true }
//           );
//         } catch (err) {
//           console.error("Error associating fcmToken: ", err);
//         }
//       }
//     });
//   };
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          dispatch(
            userDataAction.addDataToUserDataStore({
              ...userDoc.data(),
              userId: user.uid,
            })
          );
        }
      }
    };
    fetchUserData();
  }, [isLoading]);
  // const requestPermission = async () => {
  //   try {
  //     const permission = await Notification.requestPermission();
  //     if (permission === "granted") {
  //       // Generate token using the VAPID key
  //       const token = await getToken(messaging, { vapidKey: VAPID_KEY });
  //       // console.log("FCM token: ", token);
  //       // Here you can send this token to your Firebase database to associate it with the current user
  //       addFCMTokenToCurrentUser(token);
  //     } else if (permission === "denied") {
  //       console.log("Notification permission denied");
  //     }
  //   } catch (error) {
  //     console.error("Error generating FCM token:", error);
  //   }
  // };

  // useEffect(() => {
  //   // Request user for notification permission and generate FCM token
  //   requestPermission();
  // }, []);

  useEffect(() => {
    // Simulating a delay to mimic component rendering time
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(doc(db, "notifications", "jobs"), (doc) => {
  //     if (doc.exists()) {
  //       const data = doc.data();
  //       if (data.lastJobPosted) {
  //         // Send a notification
  //         if (
  //           "Notification" in window &&
  //           Notification.permission === "granted"
  //         ) {
  //           new Notification("New Job Posted!", {
  //             body: `${data.jobTitle} - ${data.jobCompany}`,
  //             icon: "/path/to/your/icon.png", // Replace with your icon path
  //           });
  //         }
  //       }
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);
  return (
    <AuthProvider>
      <Router>{isLoading ? <LoadingSpinner /> : <Routes />}</Router>
    </AuthProvider>
  );
}

export default App;

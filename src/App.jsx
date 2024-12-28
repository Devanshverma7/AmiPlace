import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./components/Auth/Routes";
import { AuthProvider } from "./components/Auth/AuthContext";
import LoadingSpinner from "./components/xyzComponents/LoadingSpinner";
import { auth, db } from "./firebase.config";
import { useDispatch } from "react-redux";
import { userDataAction } from "./store/userDetailsSlice";
import { doc, getDoc } from "firebase/firestore";
import Header from "./components/xyzComponents/Header";

function App() {
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    // Simulating a delay to mimic component rendering time
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header />
        {isLoading ? <LoadingSpinner /> : <Routes />}
      </Router>
    </AuthProvider>
  );
}

export default App;

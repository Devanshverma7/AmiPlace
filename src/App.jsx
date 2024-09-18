import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./components/Auth/Routes";
import { AuthProvider } from "./components/Auth/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay to mimic component rendering time
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the delay time as needed

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AuthProvider>
      <Router>{isLoading ? <LoadingSpinner /> : <Routes />}</Router>
    </AuthProvider>
  );
}

export default App;

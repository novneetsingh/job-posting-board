import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Error from "./Pages/Error";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import PostJob from "./Pages/PostJob";

const App = () => {
  // Helper function to check if the user is logged in
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return !!localStorage.getItem("authToken"); // Return true if token exists, otherwise false
  };

  useEffect(() => {
    // If the user is logged in, navigate to PostJob
    if (isLoggedIn()) {
      navigate("/post-job");
    }
  }, [navigate]); // Added navigate as a dependency to avoid potential issues

  return (
    <div className="w-screen min-h-screen">
      <Routes>
        {/* Redirect to PostJob if logged in, else show Signup */}
        <Route path="/" element={<Signup />} />

        {/* Prevent access to Login when logged in */}
        <Route
          path="/login"
          element={isLoggedIn() ? <Navigate to="/post-job" /> : <Login />}
        />

        {/* Protected Route for Post Job */}
        <Route
          path="/post-job"
          element={isLoggedIn() ? <PostJob /> : <Navigate to="/login" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;

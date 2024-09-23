import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import SignUpPage from "./SignUpPage";
import Forgot_pass from "./Forgot_pass";
import Dashboard from "../Discussion/Dashboard";
import { AuthContext } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import CompaniesMain from "../Companies/CompaniesMain";
import Display_profile from "../Profile/Display_profile";
import FeatureBugForm from "../FeatureBugForm";
import DisplayOnlyProfile from "../seeProfile/DisplayOnlyProfile";
import LikedByList from "../Discussion/Post/LikedByList";
import NotificationPage from "../Notifications/NotificationPage";
import SeePostFromNotify from "../Discussion/Post/SeePostFromNotify";
import EmailVerificationRequired from "./EmailVerificationRequired";
import VerifyEmail from "./VerifyEmail";
// import BuyBlueTick from "../BuyBlueTick";

const Router = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser && currentUser.emailVerified ? (
            <Dashboard />
          ) : (
            <SignUpPage />
          )
        }
      />
      <Route path="/SignUpPage" element={<SignUpPage />} />
      <Route
        path="/Login"
        element={
          currentUser && currentUser.emailVerified ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/Forgot_pass"
        element={
          currentUser && currentUser.emailVerified ? (
            <Navigate to="/dashboard" />
          ) : (
            <Forgot_pass />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/companies" element={<CompaniesMain />}></Route>
      <Route path="/profile" element={<Display_profile />}></Route>
      <Route path="/FeatureBugForm" element={<FeatureBugForm />}></Route>
      <Route
        path="/DisplayOnlyProfile"
        element={<DisplayOnlyProfile />}
      ></Route>
      <Route path="/LikedByList" element={<LikedByList />}></Route>
      <Route path="/Notifications" element={<NotificationPage />}></Route>
      <Route path="/SeePostFromNotify" element={<SeePostFromNotify />}></Route>
      <Route
        path="/email-verification-required"
        element={<EmailVerificationRequired />}
      />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* <Route path="/AccountVerification" element={<BuyBlueTick />} /> */}
    </Routes>
  );
};

export default Router;

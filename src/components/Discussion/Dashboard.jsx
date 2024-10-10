import "../../index.css";
import React, { useEffect, useState } from "react";
import BlogsContainer from "./Blog/BlogsContainer";
import RecentUpdates from "./Recent Updates/RecentUpdates";
import PostListContainer from "./Post/PostListContainer 2";
import CommunityFooter from "../xyzComponents/CommunityFooter";
import Header from "../xyzComponents/Header";
import { useDispatch } from "react-redux";
import { userDataAction } from "../../store/userDetailsSlice";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";

const Dashboard = () => {
  const RecentUpdatesClassNames =
    "recentUpdatesContainer sticky top-[-45%] hidden md:block px-7 py-5 w-[87%] rounded-md m-5 bg-[#f7f7f7] border-[0.5px] border-gray-300";
  const HeaderClassNames =
    "sticky z-30 top-0 left-0 h-16 w-full transition duration-[350ms] navigation flex justify-between items-center border-b-[0.20px] border-b-gray-500 bg-slate-200";

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
  }, [dispatch]);
  return (
    <>
      <Header HeaderClassNames={HeaderClassNames} />
      <div className="flex">
        <BlogsContainer />
        <PostListContainer />
        <div className="md:w-[32%] hidden md:block">
          <RecentUpdates RecentUpdatesClassNames={RecentUpdatesClassNames} />
          <CommunityFooter />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./postsSlice";
import userDetailsSlice from "./userDetailsSlice";
import createPostSlice from "./createPostSlice";
import blogDataSlice from "./blogDataSlice";
import companiesDataSlice from "./companiesDataSlice";
import AboutYouSlice from "./features/About_you_info/AboutYouSlice";
import KeySkillsInfoReducer from "./features/Key_Skills/KeySkills_features";
import { enableMapSet } from "immer";
import jobsSlice from "./JobsSlice";

enableMapSet();

const amiPlaceStore = configureStore({
  reducer: {
    userDetails: userDetailsSlice.reducer,
    posts: postsSlice.reducer,
    blogData: blogDataSlice.reducer,
    createPost: createPostSlice.reducer,
    companiesData: companiesDataSlice.reducer,
    AboutYou: AboutYouSlice.reducer,
    jobs: jobsSlice.reducer,
    KeySkillsData: KeySkillsInfoReducer,
  },
});
export default amiPlaceStore;

import { configureStore } from "@reduxjs/toolkit";
import logoSlice from "./LogoSlice";
import postsSlice from "./postsSlice";
import userDetailsSlice from "./userDetailsSlice";
import createPostSlice from "./createPostSlice";
import blogDataSlice from "./blogDataSlice";
import universalClickSlice from "./universalClickSlice";
import companiesDataSlice from "./companiesDataSlice";
import AboutYouReducer from "./features/About_you_info/AboutYouSlice";
import KeySkillsInfoReducer from "./features/Key_Skills/KeySkills_features";

const amiPlaceStore = configureStore({
  reducer: {
    logo: logoSlice.reducer,
    userDetails: userDetailsSlice.reducer,
    posts: postsSlice.reducer,
    blogData: blogDataSlice.reducer,
    createPost: createPostSlice.reducer,
    universalClick: universalClickSlice.reducer,
    companiesData: companiesDataSlice.reducer,
    AboutYou: AboutYouReducer,
    KeySkillsData: KeySkillsInfoReducer,
  },
});
export default amiPlaceStore;

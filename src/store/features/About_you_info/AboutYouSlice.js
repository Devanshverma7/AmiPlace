import { createSlice } from "@reduxjs/toolkit";

const UserInput = {
  FullName: "",
  Course: "",
  Branch: "",
  Semester: "",
  Specialization: "",
  Gender: "",
  DOB: "",
};
export const AboutYouSlice = createSlice({
  name: "AbotYou",
  initialState: { UserInput },
  reducers: {
    HandleInputForm: (state, action) => {
      state.UserInput = action.payload;
    },
  },
});
export const InfoAction = AboutYouSlice.actions;
export default AboutYouSlice;

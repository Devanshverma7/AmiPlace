import { createSlice } from "@reduxjs/toolkit";

let userDataStored = {};
const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    userData: userDataStored,
  },
  reducers: {
    addDataToUserDataStore: (state, action) => {
      userDataStored = action.payload;
      state.userData = userDataStored;
    },
  },
});

export const userDataAction = userDetailsSlice.actions;
export default userDetailsSlice;

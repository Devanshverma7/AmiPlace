import { createSlice } from "@reduxjs/toolkit";

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    create: false,
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    createPost: (state) => {
      state.create = !state.create;
    },
  },
});

export const { setJobs, createPost } = jobsSlice.actions;
export default jobsSlice;

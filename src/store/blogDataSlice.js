import { createSlice } from "@reduxjs/toolkit";

const blogDataSlice = createSlice({
  name: "blogData",
  initialState: {
    blogs: [
      {
        blogId: 0,
        blogLink:
          "https://in.indeed.com/career-advice/interviewing/how-to-crack-interview",
        blogDisplayText: "How to crack any interview",
        blogKey: "b1",
      },
      {
        blogId: 1,
        blogLink:
          "https://www.preplaced.in/blog/mastering-problem-solving-skills-a-guide-for-dsa-interviews",
        blogDisplayText: "Solve any problem of DSA in less time",
        blogKey: "b2",
      },
      {
        blogId: 2,
        blogLink: "https://internshala.com/internships/",
        blogDisplayText: "Internships from Internshala",
        blogKey: "b3",
      },
      {
        blogId: 3,
        blogLink:
          "https://www.mauldineconomics.com/connecting-the-dots/no-more-recessions",
        blogDisplayText: "Recessions are no more?",
        blogKey: "b4",
      },
      {
        blogId: 4,
        blogLink:
          "https://www.linkedin.com/pulse/understanding-roles-tech-sde-swe-de-naeem-shahzad-pxixe/",
        blogDisplayText: "Who are SDE, SWE, ASE ?",
        blogKey: "b5",
      },
      {
        blogId: 5,
        blogLink: "https://www.geeksforgeeks.org/what-is-an-operating-system/",
        blogDisplayText: "Operating Systems",
        blogKey: "b6",
      },
      {
        blogId: 6,
        blogLink: "https://www.w3schools.com/git/git_intro.asp?remote=github",
        blogDisplayText: "How to use Git and GitHub",
        blogKey: "b7",
      },
      {
        blogId: 7,
        blogLink: "https://www.interviewbit.com/dbms-interview-questions/",
        blogDisplayText: "Data Base Management System",
        blogKey: "b8",
      },
      {
        blogId: 8,
        blogLink: "https://www.javatpoint.com/debugging",
        blogDisplayText: "Learn the art of debuging",
        blogKey: "b9",
      },
      {
        blogId: 9,
        blogLink:
          "https://en.wikipedia.org/wiki/Copy-and-paste_programming#:~:text=Being%20a%20form%20of%20code,for%20all%20the%20duplicate%20locations.",
        blogDisplayText: "Copy Paste is right in programming?",
        blogKey: "b10",
      },
    ],
  },
  reducers: {
    addBlog: (state, action) => {
      state.blogs.unshift(action.payload);
      state.blogs.forEach((item) => {
        item.blogId++;
      });
    },
  },
});
export const blogActions = blogDataSlice.actions;
export default blogDataSlice;

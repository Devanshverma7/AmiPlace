import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";

const POSTS_PER_PAGE = 10;

export const fetchInitialPosts = createAsyncThunk(
  "posts/fetchInitial",
  async () => {
    try {
      const postQuery = query(
        collection(db, "post"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );
      const querySnapshot = await getDocs(postQuery);
      const posts = [];
      querySnapshot.forEach((post) => {
        posts.push({ ...post.data(), id: post.id });
      });
      // console.log("Fetched initial posts:", posts.length);
      return posts;
    } catch (e) {
      console.error("Error fetching initial posts: ", e);
      throw e;
    }
  }
);

export const fetchMorePosts = createAsyncThunk(
  "posts/fetchMore",
  async (_, { getState }) => {
    const { posts } = getState().posts;
    const lastPost = posts[posts.length - 1];

    // console.log("Attempting to fetch more posts. Last post:", lastPost);

    if (!lastPost) {
      // console.log("No last post found, returning empty array");
      return [];
    }

    try {
      const postQuery = query(
        collection(db, "post"),
        orderBy("createdAt", "desc"),
        startAfter(lastPost.createdAt),
        limit(POSTS_PER_PAGE)
      );
      const querySnapshot = await getDocs(postQuery);
      const newPosts = [];
      querySnapshot.forEach((post) => {
        newPosts.push({ ...post.data(), id: post.id });
      });
      // console.log("Fetched more posts:", newPosts.length);
      return newPosts;
    } catch (e) {
      console.error("Error fetching more posts: ", e);
      throw e;
    }
  }
);
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    hasMore: true,
  },
  reducers: {
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    Liked: (state, action) => {
      const postId = action.payload.postId;
      if (action.payload.like) {
        state.posts.forEach((post) => {
          if (post.id == postId) {
            post.likes++;
            post.likedBy[action.payload.liker] = true;
            return;
          }
        });
      } else {
        state.posts.forEach((post) => {
          if (post.id == postId) {
            post.likes--;
            delete post.likedBy[action.payload.liker];
            return;
          }
        });
      }
    },
    addComment: (state, action) => {
      const postId = action.payload.postId;
      state.posts.forEach((post) => {
        if (post.id == postId) {
          post.comments.unshift(action.payload.newComment);
          return;
        }
      });
    },
    deleteComment: (state, action) => {
      const postId = action.payload.postId;
      const commentId = action.payload.id;
      state.posts.forEach((post) => {
        if (post.id == postId) {
          const _comments = post.comments.filter((com) => {
            return com.id != commentId;
          });
          post.comments = _comments;
          return;
        }
      });
    },
    upVotedComment: (state, action) => {
      const { postId, commentId, upVoted, upVoter } = action.payload;
      state.posts.forEach((post) => {
        if (post.id === postId) {
          post.comments.forEach((comment) => {
            if (comment.id === commentId) {
              if (upVoted) {
                comment.upVotes++;
                comment.upVotedBy[upVoter] = true;
              } else {
                comment.upVotes--;
                delete comment.upVotedBy[upVoter];
              }
            }
          });
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialPosts.pending, (state) => {
        state.loading = true;
        // console.log("Fetching initial posts...");
      })
      .addCase(fetchInitialPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.hasMore = action.payload.length === POSTS_PER_PAGE;
        // console.log("Updated state after initial fetch:", {
        //   postsCount: state.posts.length,
        //   loading: state.loading,
        //   hasMore: state.hasMore,
        // });
      })
      .addCase(fetchInitialPosts.rejected, (state, action) => {
        state.loading = false;
        // console.error("Failed to fetch initial posts:", action.error);
      })
      .addCase(fetchMorePosts.pending, (state) => {
        state.loading = true;
        // console.log("Fetching more posts...");
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.posts = [...state.posts, ...action.payload];
        state.loading = false;
        state.hasMore = action.payload.length === POSTS_PER_PAGE;
      })
      .addCase(fetchMorePosts.rejected, (state, action) => {
        state.loading = false;
        // console.error("Failed to fetch more posts:", action.error);
      });
  },
});

export const postsAction = postsSlice.actions;
export default postsSlice;

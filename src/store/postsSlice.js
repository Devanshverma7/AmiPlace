import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

const POSTS_PER_PAGE = 10;

const fetchUserData = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        verified: data.Verified,
        userName: data.username,
        userImage: data.avatarURL,
        yearInfo: `${data.Branch} ${data.Semester}`,
        dev: data.dev,
      };
    }
  } catch (err) {
    console.error("Error fetching user data: ", err);
  }
  return null;
};

const fetchPostsWithUserData = async (postQuery) => {
  const querySnapshot = await getDocs(postQuery);
  const postsPromises = querySnapshot.docs.map(async (postDoc) => {
    const postData = postDoc.data();
    const userData = await fetchUserData(postData.user);
    return userData
      ? {
          ...postData,
          id: postDoc.id,
          ...userData,
        }
      : null;
  });

  const posts = (await Promise.all(postsPromises)).filter(
    (post) => post !== null
  );
  return posts;
};

export const fetchInitialPosts = createAsyncThunk(
  "posts/fetchInitial",
  async () => {
    try {
      const postQuery = query(
        collection(db, "post"),
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );
      return await fetchPostsWithUserData(postQuery);
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

    if (!lastPost) {
      return [];
    }

    try {
      const postQuery = query(
        collection(db, "post"),
        orderBy("createdAt", "desc"),
        startAfter(lastPost.createdAt),
        limit(POSTS_PER_PAGE)
      );
      return await fetchPostsWithUserData(postQuery);
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
      })
      .addCase(fetchInitialPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.hasMore = action.payload.length === POSTS_PER_PAGE;
      })
      .addCase(fetchInitialPosts.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to fetch initial posts:", action.error);
      })
      .addCase(fetchMorePosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.posts = [...state.posts, ...action.payload];
        state.loading = false;
        state.hasMore = action.payload.length === POSTS_PER_PAGE;
      })
      .addCase(fetchMorePosts.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to fetch more posts:", action.error);
      });
  },
});

export const postsAction = postsSlice.actions;
export default postsSlice;

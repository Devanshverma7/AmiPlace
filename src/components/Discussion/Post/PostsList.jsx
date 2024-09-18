import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post";
import { fetchInitialPosts, fetchMorePosts } from "../../../store/postsSlice";
import PostFetchingSpinner from "../../PostFetchingSpinner";

const PostsList = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector((store) => store.posts);
  const observer = useRef();

  useEffect(() => {
    dispatch(fetchInitialPosts());
  }, [dispatch]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            dispatch(fetchMorePosts());
          }
        },
        {
          root: null,
          rootMargin: "100px",
          threshold: 0.1,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  return (
    <div className="posts-container">
      {posts.map((post, index) => (
        <Post
          ref={posts.length === index + 1 ? lastPostElementRef : null}
          key={post.id}
          postData={post}
          isOverlay={true}
        />
      ))}
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <PostFetchingSpinner />
        </div>
      )}
      {!hasMore && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No more posts!
        </div>
      )}
    </div>
  );
};

export default PostsList;

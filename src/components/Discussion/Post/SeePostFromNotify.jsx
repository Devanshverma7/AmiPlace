import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../../firebase.config";
import FullPost from "./FullPost";

const SeePostFromNotify = () => {
  const location = useLocation();
  const postId = location.state.postId;
  const recipientData = location.state.recipientData;
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postCollectionRef = collection(db, "post");
        const postDocRef = doc(postCollectionRef, postId);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          setPost({ id: postId, ...postDoc.data() });
        } else {
          setError("Post is deleted by user!");
        }
      } catch (error) {
        setError(`Error fetching post: ${error.message}`);
      }
    };

    fetchPost();
  }, []);
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="md:px-60 bg-zinc-200">
      <span className="text-sm text-red-500 pb-3">
        *A reload might require after comment / delete comment
      </span>
      {post && (
        <FullPost
          postData={{
            ...post,
            userName: recipientData.username,
            verified: recipientData.Verified,
            dev: recipientData.dev,
            yearInfo: recipientData.Semester + " " + recipientData.Branch,
            userImage: recipientData.avatarURL,
          }}
        />
      )}
    </div>
  );
};
export default SeePostFromNotify;

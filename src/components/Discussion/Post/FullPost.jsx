import CommentUtil from "./CommentUtil";
import CommentSection from "./CommentSection";
import Post from "./Post";

const FullPost = ({ postData }) => {
  const postId = postData.id;

  return (
    <>
      <Post postData={postData} isOverylay={false} />
      <CommentUtil postId={postId} />
      <CommentSection comments={postData.comments} postId={postId} />
    </>
  );
};
export default FullPost;

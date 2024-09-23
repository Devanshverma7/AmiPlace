import Comment from "./Comment";
import { nanoid } from "nanoid";

const CommentSection = ({ comments, postId }) => {
  const sortedComments = [...comments].sort((a, b) => b.upVotes - a.upVotes);
  // console.log(sortedComments);

  return (
    <div className="comment-section-container">
      {sortedComments.map((comment) => (
        <Comment key={nanoid()} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default CommentSection;

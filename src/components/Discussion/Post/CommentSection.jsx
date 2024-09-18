import Comment from "./Comment";
import { nanoid } from "nanoid";

const CommentSection = ({ comments, postId }) => {
  function getTimeDifference(timestamp) {
    const now = new Date().getTime();
    const postTime = timestamp;
    const diffTime = now - postTime;

    const minutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  return (
    <div className="comment-section-container">
      {comments.map((comment) => (
        <Comment
          key={nanoid()}
          id={comment.id}
          user={comment.user}
          comment={comment.commentContent}
          commentImg={comment.commentImg}
          timeAgo={getTimeDifference(comment.createdAt)}
          postId={postId}
        />
      ))}
    </div>
  );
};

export default CommentSection;

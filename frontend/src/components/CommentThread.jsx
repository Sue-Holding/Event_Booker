import '../styles/CommentThread.css';

export default function CommentThread({ comments = [] }) {
  if (!comments.length) return <p>No comments yet.</p>;

  return (
    <div className="comment-thread">
      <h5>Conversation</h5>
      <ul>
        {comments.map((comment, i) => (
          <li key={i} className={`comment ${comment.userRole}`}>
            <strong>{comment.userRole === "admin" ? "Admin" : "Organiser"}:</strong>{" "}
            {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

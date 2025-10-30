import '../styles/CommentThread.css';

export default function CommentThread({ comments = [] }) {
  if (!comments.length) return <p>No comments yet.</p>;

  return (
    <div className="comment-thread">
      <h5>Comments</h5>
      <ul>
        {comments.map((comment) => {
          // Parse and format the date if available
          const formattedDate = comment.date
            ? new Date(comment.date).toLocaleString('sv-SE', {
                dateStyle: 'short',
                timeStyle: 'short',
              })
            : null;

          const key = comment.id || `${comment.userRole}-${comment.date || Math.random()}`;

          return (
            <li key={key} className={`comment ${comment.userRole}`}>
              <div className="comment-header">
                <strong>{comment.userRole === 'admin' ? 'Admin' : 'Organiser'}</strong>
                {formattedDate && <span className="comment-date"> — {formattedDate}</span>}
              </div>
              <p className="comment-text">{comment.text}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

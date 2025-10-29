// new event post from organiser flow here
import { useState } from 'react';
import '../styles/CommentThread.css';

export default function AdminPendingActions() {
  const [events, setEvents] = useState([]);
  const [eventComments, setEventComments] = useState({});
  const token = localStorage.getItem('token');

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/admin/events?status=pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(data.events);
  };

  const handleAction = async (id, action, comment) => {
    await fetch(`${API_URL}/admin/events/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, comment }),
    });
    fetchEvents(); // refresh
  };

  return (
    <div>
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h4>{event.title}</h4>
          {event.status === 'pending' && (
            <div>
              <input
                type="text"
                placeholder="Comment for organiser..."
                value={eventComments[event._id] || ''}
                onChange={(e) =>
                  setEventComments((prev) => ({
                    ...prev,
                    [event._id]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() =>
                  handleAction(
                    event._id,
                    'needs-update',
                    eventComments[event._id] || 'Please fix details',
                  )
                }
              >
                ✏️ Needs Update
              </button>
              <button onClick={() => handleAction(event._id, 'approve')}>✅ Approve</button>
              <button onClick={() => handleAction(event._id, 'reject', 'Not suitable')}>
                ❌ Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

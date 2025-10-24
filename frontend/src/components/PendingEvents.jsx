// updated already approved events come into pending flow here
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommentThread from "./CommentThread";
import "../styles/PendingEvents.css";
import "../styles/button.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [eventComments, setEventComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/events?status=pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch pending events");

      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAction = async (id, action, comment) => {
    try {
      const res = await fetch(`${API_URL}/admin/events/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, comment }),
      });
      if (!res.ok) throw new Error("Action failed");

      await fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="event-page">
      <h2 className="title">Pending Events - Action Required</h2>
      <h3>Events ({events.length})</h3>

      {events.length === 0 ? (
        <p>No pending events found.</p>
      ) : (
        events.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p><strong>Status:</strong> {event.status}</p>
            <p><strong>Organizer:</strong> {event.organizer?.name} ({event.organizer?.email})</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Price:</strong> {event.price} SEK</p>
            <p><strong>Description:</strong> {event.description}</p>

            <CommentThread comments={event.adminComments} />

            <div className="event-actions">
              <Link to={`/admin-dashboard/events/${event._id}`} className="button button--primary">
                View Event
              </Link>

              <div className="top-actions">
                <button
                  className="button button--primary"
                  onClick={() => handleAction(event._id, "approve")}
                >
                  ✅ Approve
                </button>

                <button
                  className="button button--danger"
                  onClick={() => handleAction(event._id, "reject", "Not suitable")}
                >
                  ❌ Reject
                </button>
              </div>

              <div className="bottom-actions">
                <input
                  type="text"
                  placeholder="Short comment..."
                  value={eventComments[event._id] || ""}
                  onChange={(e) =>
                    setEventComments((prev) => ({
                      ...prev,
                      [event._id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="button button--warning"
                  onClick={() =>
                    handleAction(
                      event._id,
                      "needs-update",
                      eventComments[event._id] || "Please fix details"
                    )
                  }
                >
                  ✏️ Needs Update
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
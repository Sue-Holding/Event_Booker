// updated already approved events come into pending flow here
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/CommentThread.css';
import '../styles/PendingEvents.css';
import '../styles/button.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [eventComments, setEventComments] = useState({});

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/events?status=pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch pending events");

      const data = await res.json();
      setEvents(data.events);
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

      await fetchEvents(); // refresh data
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  // filter events by status and organizer
  useEffect(() => {
    let filtered = events;
    if (filterStatus) filtered = filtered.filter((e) => e.status === filterStatus);
    setFilteredEvents(filtered);
  }, [filterStatus, events]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div 
    // style={{ padding: "2rem" }}
    >
      <h2 className="title">Pending Events - Action required</h2>

      {/* event list */}
      <section>
        <h3>Events ({filteredEvents.length})</h3>
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id} className="pending-event-card">
              <h4>{event.title}</h4>
              <p>
                <strong>Status:</strong> {event.status}
              </p>
              <p>
                <strong>Organizer:</strong> {event.organizer?.name} (
                {event.organizer?.email})
              </p>
              <p>
                <strong>Price:</strong> {event.price} SEK
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Description:</strong> {event.description}
              </p>

              {/* 🗨️ Comment Thread */}
              {event.adminComments?.length > 0 && (
                <div className="comment-thread">
                  <h5>💬 Comment Thread</h5>
                  {event.adminComments.map((c, idx) => (
                    <div
                      key={idx}
                      className={`comment ${c.userRole === "admin" ? "admin" : "organiser"}`}
                    >
                      <strong>{c.userRole === "admin" ? "Admin" : "Organiser"}:</strong>{" "}
                      {c.text}
                    </div>
                  ))}
                </div>
                )}
                
                     
              {/* Action Buttons */}
              {/* <div className="pending-event-actions"> */}
              <Link 
                to={`/admin-dashboard/events/${event._id}`} 
                className="button button--primary">
                View Event
              </Link>

              {event.status === "pending" && (
                <div className="pending-event-actions">
                  <div className="top-actions">
                {/* <div style={{ marginTop: "1rem" }}> */}

                  {/* approve button */}
                  <button
                  className="button button--primary"
                    onClick={() => handleAction(event._id, "approve")}
                  >
                    ✅ Approve
                  </button>

                  {/* reject button */}
                  <button
                    className="button button--danger"
                    onClick={() =>
                      handleAction(event._id, "reject", "Not suitable")
                    }
                  >
                    ❌ Reject
                  </button>
                  </div>

                  <div className="bottom-actions">
                  {/* needs update button */}
                  <input
                    type="text"
                    placeholder="Short comment..."
                    value={eventComments[event._id] || ""}
                    onChange={(e) =>
                      setEventComments((prev) => ({ ...prev, [event._id]: e.target.value }))
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
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
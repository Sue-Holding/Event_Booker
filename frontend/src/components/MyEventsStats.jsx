import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/smallEventCard.css"; // use the small card CSS
import "../styles/button.css";
import "../styles/grid.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function MyEventsStats() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const role = token ? JSON.parse(atob(token.split(".")[1])).role : null;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/organiser/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch events");

      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading event stats...</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <div className="my-events-stats">
      <h2 className="title">My Events Overview</h2>
      {message && <p>{message}</p>}

      <div className="small-grid">
        {events.map((event) => {
          const eventLink =
            role === "organiser"
              ? `/organiser-dashboard/events/${event._id}`
              : role === "admin"
              ? `/admin-dashboard/events/${event._id}`
              : `/user-dashboard/events/${event._id}`;

          return (
            <div key={event._id} className="event-card small">
              {event.imageUrl && (
                <div className="event-card-image small">
                  <img src={`${API_URL}${event.imageUrl}`} alt={event.title} />
                </div>
              )}
              <div className="small-card-content">
                <h4>{event.title}</h4>
                <p>Bookings: {event.bookings?.length ?? 0}</p>
                <p>Status: {event.status}</p>
                <Link to={eventLink} className="button button--primary">
                  View Event
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
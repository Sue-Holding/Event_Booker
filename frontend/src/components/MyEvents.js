import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/organiser/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch events");

        setEvents(data); // expecting an array of events
      } catch (err) {
        setMessage(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Events</h2>
      {message && <p>{message}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "5px" }}>
              <strong>{event.title}</strong><br />
              <em>{new Date(event.date).toLocaleDateString()} {event.time}</em><br />
              <span>Location: {event.location}</span><br />
              <span>Category: {event.category}</span><br />
              <span>Price: ${event.price}</span><br />
              <span>Status: {event.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

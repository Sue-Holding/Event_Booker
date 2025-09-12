import { useEffect, useState } from "react";

export default function MainContent() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5050/event");
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Filter events on search
  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upcoming Events</h2>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
      />

      {filteredEvents.length === 0 ? (
        <p>No events found</p>
      ) : (
        <ul>
          {filteredEvents.map((event) => (
            <li key={event._id} style={{ marginBottom: "1rem" }}>
              <strong>{event.title}</strong> - {event.category} <br />
              {new Date(event.date).toLocaleDateString()} | {event.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

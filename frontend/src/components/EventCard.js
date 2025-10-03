// import React from "react";
import { Link } from "react-router-dom";
// import EventDetails from "./EventDetails";

export default function EventCard({ event }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{event.title}</h3>
      <p style={styles.category}>{event.category}</p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {event.time || "TBA"}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Price:</strong> {event.price === 0 ? "Free" : `${event.price} SEK`}
      </p>

      {/* absolute path needed */}
      {/* <Link to={`events/${event._id}`} style={styles.button}> */}
      <Link to={`/user-dashboard/events/${event._id}`} style={styles.button}>
        View Event
      </Link>

    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  title: {
    margin: "0 0 0.5rem 0",
  },
  category: {
    color: "#666",
    fontStyle: "italic",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

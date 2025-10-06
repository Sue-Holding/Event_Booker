import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/eventcard.css";

const MotionLink = motion(Link);

export default function EventCard({ event }) {
  // Try to get role from localStorage user first
  let role = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    role = JSON.parse(storedUser).role;
  }

  // fallback: try decode token if localStorage user is missing
  if (!role) {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
      } catch (err) {
        console.error("Failed to decode token for role", err);
      }
    }
  }

  // Decide the route based on role
  const eventLink =
    role === "organiser"
      ? `/organiser-dashboard/events/${event._id}`
      : role === "admin"
      ? `/admin-dashboard/events/${event._id}`
      : `/user-dashboard/events/${event._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.4 }}
      className="event-card"
    >
      <h3>{event.title}</h3>
      <p>{event.category}</p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Price:</strong> {event.price === 0 ? "Free" : `${event.price} SEK`}
      </p>

      <MotionLink
        to={eventLink}
        className="button"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        View Event
      </MotionLink>
    </motion.div>
  );
}
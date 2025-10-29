import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/smallEventCard.css";
import "../styles/button.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function SmallEventCard({ event, isExpanded, onToggle, children, fullExpand }) {
  // Get user role from localStorage or JWT token
  let role = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    role = JSON.parse(storedUser).role;
  }

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

  // Route based on role
  const eventLink =
    role === "organiser"
      ? `/dashboard/events/${event._id}`
      : role === "admin"
      ? `/dashboard/events/${event._id}`
      : `/dashboard/events/${event._id}`;

  const handleCardClick = (e) => {
    // Prevent toggling when clicking inside buttons or links
    if (e.target.closest("button") || e.target.closest("a")) return;
    onToggle?.();
  };

  return (
    <motion.div
      className={`event-card small ${isExpanded ? "expanded" : ""} ${fullExpand ? "full-expand" : ""}`}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
    >
      {event.imageUrl && (
        <div className="event-card-image small">
          <img src={`${API_URL}${event.imageUrl}`} alt={event.title} />
        </div>
      )}
      <div className="small-card-content">
        <h4>{event.title}</h4>
        <p>{new Date(event.date).toLocaleDateString()}</p>

        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
          <Link to={eventLink} 
          className="button button--primary">
            View Event
          </Link>
        </motion.div>

        {children && isExpanded && <div className="card-footer">{children}</div>}
      </div>
    </motion.div>
  );
}

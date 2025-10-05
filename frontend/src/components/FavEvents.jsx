import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL;

export default function FavEvent() {
  const [favorites, setFavorites] = useState([]);
  // const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch favourites");

        setFavorites(data.favorites || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (eventId) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/users/favorites/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to remove favourite");

        // Update local state to reflect removal
        setFavorites((prev) => prev.filter((fav) => fav._id !== eventId));
      } catch (err) {
        console.error(err);
      }
    };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>⭐ My Favourite Events</h2>

      {favorites.length === 0 ? (
        <p>No favourite events yet.</p>
      ) : (
        <div className="event-grid">
          {favorites.map((event) => (
            <motion.div
              key={event._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={{ position: "relative" }}
            >
              <EventCard event={event} />
              <button
                onClick={() => removeFavorite(event._id)}
                className="remove-btn"
              >
                ✖ Remove
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}


// <ul>
        //   {favorites.map(event => (
        //     <li key={event._id} style={{ marginBottom: "1rem" }}>
        //       <h3>{event.title}</h3>
        //       <p>{event.location}</p>
        //       <p>{new Date(event.date).toLocaleDateString()}</p>
        //       <p>{event.price} SEK</p>

        //       {/* remove from favourites */}
        //       <button onClick={() => removeFavorite(event._id)}>
        //         Remove from favourites
        //       </button>
        //       <Link to={`/user-dashboard/events/${event._id}`} style={styles.button}>
        //         View Details
        //       </Link>

        //     </li>
        //   ))}
        // </ul>

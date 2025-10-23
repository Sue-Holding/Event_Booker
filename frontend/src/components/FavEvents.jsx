import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { motion } from "framer-motion";
import '../styles/button.css';

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
      <h2 className="title">My Favourite Events</h2>

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
              className="event-wrapper"
            >

              <EventCard event={event}>
                <button
                  onClick={() => removeFavorite(event._id)}
                  // className="remove-btn inside-card"
                  className="button button--warning"
                >
                  ✖ Remove from Favourites
                </button>
              </EventCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

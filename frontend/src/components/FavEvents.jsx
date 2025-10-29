import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard from "./EventCard";
import SmallEventCard from "./SmallEventCard";
import useViewport from "../hooks/useViewport";
import '../styles/button.css';
import '../styles/styles.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function FavEvent() {
  const { isMobile, isTablet } = useViewport();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

    const handleCardToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };


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
      className="page-container full-width"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="title">My Favourite Events</h2>

      {favorites.length === 0 ? (
        <p>No favourite events yet.</p>
      ) : (
        <div className={isMobile || isTablet ? "small-grid" : "event-grid"}>
          {favorites.map((event) => (
            <motion.div
              key={event._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={{ position: "relative" }}
              className="event-wrapper"
            >
              {isMobile || isTablet ? (
                <SmallEventCard 
                  event={event}
                  showDetailsButton={true}
                  isExpanded={expandedId === event._id}
                  onToggle={() => handleCardToggle(event._id)}
                  >
                  <button
                    onClick={() => removeFavorite(event._id)}
                    className="button button--warning"
                  >
                    ✖ Remove
                  </button>
                </SmallEventCard>
              ) : (
              <EventCard event={event}>
                <button
                  onClick={() => removeFavorite(event._id)}
                  className="button button--warning"
                >
                  ✖ Remove from Favourites
                </button>
              </EventCard>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

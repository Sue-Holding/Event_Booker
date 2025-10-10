import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard from "./EventCard";

const API_URL = process.env.REACT_APP_API_URL;

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  // fetch event by id
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/event/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  const toggleFavourite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    setLoading(true);
    try {
      const url = `${API_URL}/users/favorites/${id}`;
      const method = isFavourite ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setIsFavourite(!isFavourite);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating favourites");
    }
    setLoading(false);
  };

  const bookEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first!");

    try {
      const confirmed = window.confirm("Proceed with dummy payment?");
      if (!confirmed) return;

      const res = await fetch(`${API_URL}/users/bookings/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      alert(`✅ Booked! Reference: ${data.bookingRef}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <motion.div
      style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="button secondary"
        style={{ marginBottom: "1.5rem" }}
      >
        ← Back to Search
      </motion.button>

      {/* Event Info and buttons*/}
      <EventCard event={event}>
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          marginTop: "1rem", 
          justifyContent: "center" 
        }}>
      <motion.button
          onClick={toggleFavourite}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="button"
        >
          {isFavourite ? "★ Remove Favourite" : "☆ Add Favourite"}
        </motion.button>

        <motion.button
          onClick={bookEvent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="button primary"
        >
          🎟️ Book Event
        </motion.button>
        </div>
      </EventCard>
    </motion.div>
  );
}
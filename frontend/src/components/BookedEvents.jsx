import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard from "./EventCard";
import '../styles/button.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function BookedEvents() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
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
        if (!res.ok) throw new Error(data.message || "Failed to fetch booked events");

        setBookings(data.bookedEvents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/users/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel booking");

      // Update local state
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("Booking canceled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
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
      <h2 className="title">My Booked Events</h2>

      {bookings.length === 0 ? (
        <p>You haven’t booked any events yet.</p>
      ) : (
        <div className="event-grid">
          {bookings.map((b) => {
            // Check if event data exists
            if (!b.event || !b.event._id) {
              console.error("Invalid event data:", b);
              return null; // Skip rendering this booking
            }

            return (
              <motion.div
                key={b._id}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
                className="event-wrapper"
              >
                <EventCard
                  event={b.event}
                  bookingRef={b.bookingRef}
                >
                  <button
                    onClick={() => cancelBooking(b._id)}
                    className="button button--warning"
                  >
                    ❌ Cancel Booking
                  </button>
                </EventCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
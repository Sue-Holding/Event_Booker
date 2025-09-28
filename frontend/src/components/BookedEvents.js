import { useEffect, useState } from "react";

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

      // Remove from local state
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("Booking canceled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Booked Events</h2>

      {bookings.length === 0 ? (
        <p>You haven’t booked any events yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: "1rem" }}>
              <h3>{b.event.title}</h3>
              <p>{b.event.location}</p>
              <p>{new Date(b.event.date).toLocaleDateString()}</p>
              <p>Booking Ref: <strong>{b.bookingRef}</strong></p>
              <p>Price: {b.event.price} SEK</p>
              <button onClick={() => cancelBooking(b._id)}>
                ❌ Cancel Booking
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

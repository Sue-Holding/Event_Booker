import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import SmallEventCard from './SmallEventCard';
import useViewport from '../hooks/useViewport';
import '../styles/button.css';
import '../styles/styles.css';

import { getUser, getBookedEvents } from '../idb';

const API_URL = process.env.REACT_APP_API_URL;

export default function BookedEvents() {
  const { isMobile, isTablet } = useViewport();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
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
        if (!res.ok) throw new Error(data.message || 'Failed to fetch booked events');

        setBookings(data.bookedEvents || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // new version with offline support - not fetching yet
  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) return setLoading(false);

  //     const cachedUser = await getUser(token);
  //     if (!cachedUser) return setLoading(false);

  //     if (navigator.onLine) {
  //       try {
  //         const res = await fetch(`${API_URL}/users/me`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         const data = await res.json();
  //         if (res.ok) {
  //           setBookings(data.bookedEvents || []);
  //         }
  //       } catch (err) {
  //         console.error(err);
  //         const cachedBookings = await getBookedEvents(cachedUser.email);
  //         setBookings(cachedBookings || []);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       const cachedBookings = await getBookedEvents(cachedUser.email);
  //       setBookings(cachedBookings || []);
  //       setLoading(false);
  //     }
  //   };
  //   fetchBookings();
  // }, []);

  const handleCardToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/users/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel booking');

      // Update local state
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert('Booking canceled successfully!');
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
        <div className={isMobile || isTablet ? 'small-grid' : 'event-grid'}>
          {bookings.map((b) => {
            // Check if event data exists
            if (!b.event || !b.event._id) {
              console.error('Invalid event data:', b);
              return null; // Skip rendering this booking
            }

            return (
              <motion.div
                key={b._id}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
                className="event-wrapper"
              >
                {isMobile || isTablet ? (
                  <SmallEventCard
                    event={b.event}
                    bookingRef={b.bookingRef}
                    showDetailsButton
                    isExpanded={expandedId === b.event._id}
                    onToggle={() => handleCardToggle(b.event._id)}
                  >
                    <button onClick={() => cancelBooking(b._id)} className="button button--warning">
                      ❌ Cancel
                    </button>
                  </SmallEventCard>
                ) : (
                  <EventCard event={b.event} bookingRef={b.bookingRef}>
                    <button onClick={() => cancelBooking(b._id)} className="button button--warning">
                      ❌ Cancel Booking
                    </button>
                  </EventCard>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

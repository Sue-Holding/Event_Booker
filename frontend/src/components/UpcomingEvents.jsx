import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SmallEventCard from './SmallEventCard';
import '../styles/grid.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/event`);
        const data = await res.json();

        // Filter events within 5 days from now
        const now = new Date();
        const fiveDaysLater = new Date();
        fiveDaysLater.setDate(now.getDate() + 5);

        const upcoming = data.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= fiveDaysLater;
        });

        setEvents(upcoming);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  if (loading) return <p>Loading upcoming events...</p>;
  if (events.length === 0) return <p>No upcoming events in the next 5 days.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="title">Upcoming Events</h2>

      <div className="small-grid">
        {events.map((event) => (
          <SmallEventCard key={event._id} event={event} />
        ))}
      </div>
    </motion.div>
  );
}

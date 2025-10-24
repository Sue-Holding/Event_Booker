import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SmallEventCard from "./SmallEventCard";

const API_URL = process.env.REACT_APP_API_URL;

export default function NewlyAdded() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/event`);
        const data = await res.json();

        // Get the date 2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Filter events created within the last 2 days and approved
        const recent = data.filter((event) => {
          const createdAt = new Date(event.createdAt);
          return createdAt >= twoDaysAgo && event.status === "approved";
        });

        // Sort by createdAt descending (newest first)
        const sorted = recent.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setEvents(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewEvents();
  }, []);

  if (loading) return <p>Loading newly added events...</p>;
  if (events.length === 0) return <p>No new events added in the last 2 days.</p>;

  return (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="title">Newly Added (Last 2 Days)</h2>
    <div className="small-grid">
      {events.map((event) => (
        <SmallEventCard key={event._id} event={event} />
      ))}
    </div>
  </motion.div>
);
}



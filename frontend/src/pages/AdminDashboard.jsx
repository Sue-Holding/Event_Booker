// for admin dashboard
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSearch from "../components/EventSearch";
import EventDetails from "../components/EventDetails";
import EventStats from "../components/EventStats";
import UserSettings from "../components/UserSettings";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ name: payload.name, role: payload.role });
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <div>
      <Header />
      {user ? (
        <motion.div
          className="dashboard-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route index element={<EventStats />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="event-stats" element={<EventStats />} />
            <Route path="user-settings" element={<UserSettings />} />
          </Routes>
          <Footer />
        </motion.div>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}


     
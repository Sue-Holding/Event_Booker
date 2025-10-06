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
import FloatingWords from "../components/FloatingWords";
import "../styles/dashboard.css";

const categories = ["Music", "Kids", "Sport", "Food", "Tech", "Art"];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    <div className="dashboard-page">
      <Header />

      {/* Floating words */}
            <FloatingWords 
              categories={categories} 
              onSelect={setSelectedCategory} 
            />

      <motion.div
        className="dashboard-content glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Admin Control Center</h2>
          <Routes>
            <Route index element={<EventStats />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="event-stats" element={<EventStats />} />
            <Route path="user-settings" element={<UserSettings />} />
          </Routes>

        </motion.div>

        <Footer />
    </div>
  );
}


     
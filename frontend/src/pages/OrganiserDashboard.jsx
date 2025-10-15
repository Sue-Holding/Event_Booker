// for organiser dashboard
import { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import EventSearch from "../components/EventSearch";
// import EventDetails from "../components/EventDetails";
// import AddNewEvent from "../components/AddNewEvent";
// import MyEvents from "../components/MyEvents";
import FloatingWords from "../components/FloatingWords";
// import UpdatesRequired from "../components/UpdatesRequired";
import "../styles/dashboard.css";

const categories = ["Music", "Kids", "Sport", "Food", "Tech", "Art"];

export default function OrganiserDashboard() {
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

      {/* Organiser content */}
      <motion.div
        className="dashboard-content glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* <h2>{selectedCategory 
          ? `${selectedCategory} Events` 
          : "Discover Events"}
        </h2> */}

        {/* <EventSearch category={selectedCategory} /> */}
      
      {/* <UpdatesRequired /> */}

      <Outlet />
      
      </motion.div>
      
      <Footer />
    </div>
  );
}
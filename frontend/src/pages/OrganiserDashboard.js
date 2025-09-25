// for organiser dashboard
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSearch from "../components/EventSearch";
import AddNewEvent from "../components/AddNewEvent";
import MyEvents from "../components/MyEvents";

export default function OrganiserDashboard() {
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
          <div style={{ padding: "2rem" }}>
            <p>You are logged in as: {user.role}</p>

      {/* Nested routes */}
        <Routes>
          <Route index element={<EventSearch />} /> {/* default */}
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/new" element={<AddNewEvent />} />
            <Route path="my-events" element={<MyEvents />} />
        </Routes>

      <Footer />
          </div>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}
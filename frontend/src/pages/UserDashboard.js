// for user / attendee
import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSearch from "../components/EventSearch";
import FavEvents from "../components/FavEvents";
import BookedEvents from "../components/BookedEvents";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // simple decode
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
            <Route path="favourites" element={<FavEvents />} />
            <Route path="booked-events" element={<BookedEvents />} />
          </Routes>

          <Footer />
          </div>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}

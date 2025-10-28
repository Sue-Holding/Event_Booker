import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import FloatingWords from "../components/FloatingWords";
import "../styles/dashboard.css";

const categories = ["Music", "Kids", "Sport", "Food", "Tech", "Art"];

export default function DashboardLayout() {
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

      {/* <FloatingWords categories={categories} onSelect={setSelectedCategory} /> */}

      <main className="dashboard-content full-width">
        <Outlet context={{ user, selectedCategory }} />
        {/* <Outlet user={user} selectedCategory={selectedCategory} /> */}
      </main>

      <Footer />
    </div>
  );
}

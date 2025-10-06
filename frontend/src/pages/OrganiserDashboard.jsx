// for organiser dashboard
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSearch from "../components/EventSearch";
import EventDetails from "../components/EventDetails";
import AddNewEvent from "../components/AddNewEvent";
import MyEvents from "../components/MyEvents";
import FloatingWords from "../components/FloatingWords";
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
        <h2>{selectedCategory ? `${selectedCategory} Events` : "Discover Events"}</h2>
        {/* <EventSearch category={selectedCategory} /> */}
      
        <Routes>
           <Route index element={<MyEvents />} />
           <Route path="organiser-dashboard" element={<OrganiserDashboard />} />
           <Route path="search-events" element={<EventSearch />} />
           <Route path="events/:id" element={<EventDetails />} />
           <Route path="events/new" element={<AddNewEvent />} />
           <Route path="my-events" element={<MyEvents />} />
         </Routes>
      
      </motion.div>
      
      <Footer />
    </div>
  );
}


//   return (
//     <div>
//       <Header />
//       {user ? (
//         <motion.div
//           className="dashboard-container"
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Routes>
//             <Route index element={<MyEvents />} />
//             <Route path="search-events" element={<EventSearch />} />
//             <Route path="events/:id" element={<EventDetails />} />
//             <Route path="events/new" element={<AddNewEvent />} />
//             <Route path="my-events" element={<MyEvents />} />
//           </Routes>
//           <Footer />
//         </motion.div>
//       ) : (
//         <p>Please log in to view your dashboard.</p>
//       )}
//     </div>
//   );
// }
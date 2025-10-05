// for organiser dashboard
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSearch from "../components/EventSearch";
import AddNewEvent from "../components/AddNewEvent";
import MyEvents from "../components/MyEvents";
import "../styles/dashboard.css";

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
        <motion.div
          className="dashboard-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route index element={<MyEvents />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/new" element={<AddNewEvent />} />
            <Route path="my-events" element={<MyEvents />} />
          </Routes>
          <Footer />
        </motion.div>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import EventSearch from "../components/EventSearch";
// import AddNewEvent from "../components/AddNewEvent";
// import MyEvents from "../components/MyEvents";
// import "../styles/dashboard.css";

// export default function OrganiserDashboard() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       setUser({ name: payload.name, role: payload.role });
//     } catch (err) {
//       console.error("Invalid token");
//       localStorage.removeItem("token");
//     }
//   }, []);

//   return (
//     <div>
//       <Header />
//       {user ? (
//           <div style={{ padding: "2rem" }}>

//       {/* Nested routes */}
//         <Routes>
//           <Route index element={<EventSearch />} /> {/* default */}
//             <Route path="search-events" element={<EventSearch />} />
//             <Route path="events/new" element={<AddNewEvent />} />
//             <Route path="my-events" element={<MyEvents />} />
//         </Routes>

//       <Footer />
//           </div>
//       ) : (
//         <p>Please log in to view your dashboard.</p>
//       )}
//     </div>
//   );
// }
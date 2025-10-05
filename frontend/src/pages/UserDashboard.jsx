// for user / attendee
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventSearch from "../components/EventSearch";
import FavEvents from "../components/FavEvents";
import BookedEvents from "../components/BookedEvents";
import EventDetails from "../components/EventDetails";
import "../styles/dashboard.css";

export default function UserDashboard() {
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
            <Route index element={<BookedEvents />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="favourites" element={<FavEvents />} />
            <Route path="booked-events" element={<BookedEvents />} />
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
// import { Routes, Route, Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import EventSearch from "../components/EventSearch";
// import FavEvents from "../components/FavEvents";
// import BookedEvents from "../components/BookedEvents";
// import EventDetails from "../components/EventDetails";
// import "../styles/dashboard.css";

// export default function UserDashboard() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1])); // simple decode
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

//           {/* Nested routes */}
//           <Routes>
//             {/* default */}
//             <Route index element={<EventSearch />} /> 
//             {/* child routes */}
//             <Route path="search-events" element={<EventSearch />} />
//             <Route path="events/:id" element={<EventDetails />} />
//             <Route path="favourites" element={<FavEvents />} />
//             <Route path="booked-events" element={<BookedEvents />} />
//           </Routes>
//           {/* <Outlet /> */}

//           <Footer />
//           </div>
//       ) : (
//         <p>Please log in to view your dashboard.</p>
//       )}
//     </div>
//   );
// }

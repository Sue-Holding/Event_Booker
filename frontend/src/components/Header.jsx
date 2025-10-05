import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="header"
    >
      <motion.nav
        className="nav"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.3, staggerChildren: 0.15 },
          },
        }}
      >
        <h2 className="logo">Eventure</h2>

        <ul className="links">
          {user?.role === "attendee" && (
            <>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/user-dashboard/search-events">Search</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/user-dashboard/favourites">Favourites</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/user-dashboard/booked-events">Bookings</Link>
              </motion.li>
            </>
          )}

          {user?.role === "organiser" && (
            <>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/organiser-dashboard/my-events">My Events</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/organiser-dashboard/events/new">Add Event</Link>
              </motion.li>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/admin-dashboard/event-stats">Stats</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }}>
                <Link to="/admin-dashboard/user-settings">Users</Link>
              </motion.li>
            </>
          )}

          {user ? (
            <motion.li whileHover={{ scale: 1.1 }}>
              <button onClick={handleLogout} className="logout">
                Logout
              </button>
            </motion.li>
          ) : (
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="/">Login/Register</Link>
            </motion.li>
          )}
        </ul>
      </motion.nav>
    </motion.header>
  );
}



// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import { motion } from "framer-motion";

// export default function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser(decoded);
//       } catch {
//         localStorage.removeItem("token");
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <motion.header
//       className="header"
//       initial={{ y: -80, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//     >
//       <nav className="nav">
//         {user && <p>Welcome, {user.name}! Role: {user.role}</p>}
//         <motion.h2
//           className="logo"
//           whileHover={{ scale: 1.1, rotate: -2 }}
//           transition={{ type: "spring", stiffness: 200 }}
//         >
//           Eventure
//         </motion.h2>

//         <ul className="links">
//           {user?.role === "attendee" && (
//             <>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/user-dashboard/search-events">Search Events</Link>
//               </motion.li>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/user-dashboard/favourites">Favourites</Link>
//               </motion.li>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/user-dashboard/booked-events">Booked Events</Link>
//               </motion.li>
//             </>
//           )}

//           {user?.role === "organiser" && (
//             <>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/organiser-dashboard/search-events">Search Events</Link>
//               </motion.li>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/organiser-dashboard/events/new">Add New Event</Link>
//               </motion.li>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/organiser-dashboard/my-events">My Events</Link>
//               </motion.li>
//             </>
//           )}

//           {user?.role === "admin" && (
//             <>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/admin-dashboard/search-events">Search Events</Link>
//               </motion.li>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/admin-dashboard/event-stats">Event Stats</Link>
//               </motion.li>
//               <motion.li whileHover={{ scale: 1.1 }}>
//                 <Link to="/admin-dashboard/user-settings">User Settings</Link>
//               </motion.li>
//             </>
//           )}

//           {user && (
//             <motion.li whileHover={{ scale: 1.1 }}>
//               <button onClick={handleLogout} className="logout">Logout</button>
//             </motion.li>
//           )}
//           {!user && (
//             <motion.li whileHover={{ scale: 1.1 }}>
//               <Link to="/">Login/Register</Link>
//             </motion.li>
//           )}
//         </ul>
//       </nav>
//     </motion.header>
//   );
// }



// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// export default function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser(decoded); // decoded contains at least { id, role, name, iat, exp }
//       } catch {
//         localStorage.removeItem("token");
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/"); // redirect to landing page
//   };

//   return (
//     <header style={styles.header}>
//       <nav style={styles.nav}>
//         {user && <p>Welcome, {user.name}! Role: {user.role}</p>}
//         <h2 style={styles.logo}>Eventure</h2>
        
//         <ul style={styles.links}>
//           <ul style={styles.links}>
//               {/* <li><Link to="/dashboard">Home</Link></li> */}

//               {user?.role === "attendee" && (
//                 <>
//                   <li><Link to="/user-dashboard/search-events">Search Events</Link></li>
//                   <li><Link to="/user-dashboard/favourites">Favourites</Link></li>
//                   <li><Link to="/user-dashboard/booked-events">Booked Events</Link></li>
//                 </>
//               )}

//               {user?.role === "organiser" && (
//                 <>
//                   <li><Link to="/organiser-dashboard/search-events">Search Events</Link></li>
//                   <li><Link to="/organiser-dashboard/events/new">Add New Event</Link></li>
//                   <li><Link to="/organiser-dashboard/my-events">My Events</Link></li>
//                 </>
//               )}

//               {user?.role === "admin" && (
//                 <>
//                   <li><Link to="/admin-dashboard/search-events">Search Events</Link></li>
//                   <li><Link to="/admin-dashboard/event-stats">Event Stats</Link></li>
//                   <li><Link to="/admin-dashboard/user-settings">User Settings</Link></li>
//                 </>
//               )}

//               {user && <li><button onClick={handleLogout} style={styles.logout}>Logout</button></li>}
//               {!user && <li><Link to="/">Login/Register</Link></li>}
//             </ul>
//         </ul>
//       </nav>
//     </header>
//   );
// }

// const styles = {
//   header: { background: "#282c34", padding: "1rem", color: "white" },
//   nav: { display: "flex", justifyContent: "space-between", alignItems: "center" },
//   logo: { margin: 0 },
//   links: { listStyle: "none", display: "flex", gap: "1rem", margin: 0, padding: 0 },
//   logout: {
//     background: "transparent",
//     border: "1px solid white",
//     color: "white",
//     padding: "0.25rem 0.5rem",
//     cursor: "pointer",
//   },
// };
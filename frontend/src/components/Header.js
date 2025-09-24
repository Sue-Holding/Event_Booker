import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded contains at least { id, role, name, iat, exp }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); // redirect to landing page
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>Eventure</h2>
        <ul style={styles.links}>
          <ul style={styles.links}>
              <li><Link to="/dashboard">Home</Link></li>

              {user?.role === "attendee" && (
                <>
                  <li><Link to="/favorites">Favorites</Link></li>
                  <li><Link to="/booked-events">Booked Events</Link></li>
                </>
              )}

              {user?.role === "organiser" && (
                <>
                  <li><Link to="/events/new">Add New Event</Link></li>
                  <li><Link to="/my-events">My Events</Link></li>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  {/* <li><Link to="/admin-dashboard">Dashboard</Link></li> */}
                  <li><Link to="/search-events">Search Events</Link></li>
                  <li><Link to="/stats">Stats</Link></li>
                </>
              )}

              {user && <li><button onClick={handleLogout} style={styles.logout}>Logout</button></li>}
              {!user && <li><Link to="/">Login/Register</Link></li>}
            </ul>
        </ul>
      </nav>
    </header>
  );
}

const styles = {
  header: { background: "#282c34", padding: "1rem", color: "white" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { margin: 0 },
  links: { listStyle: "none", display: "flex", gap: "1rem", margin: 0, padding: 0 },
  logout: {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "0.25rem 0.5rem",
    cursor: "pointer",
  },
};






// export default function Header() {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check if user is logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/"); // redirect to landing page
//     setIsLoggedIn(false);
//   };


//   return (
//     <header style={styles.header}>
//       <nav style={styles.nav}>
//         <h2 style={styles.logo}>🎟 Event Booker</h2>
//         <ul style={styles.links}>
//           <li><Link to="/home">Home</Link></li>
//           {isLoggedIn && <li><Link to="/user-dashboard">User Dashboard</Link></li>}
//           {isLoggedIn && <li><Link to="/organiser-dashboard">Organiser Dashboard</Link></li>}
//           {isLoggedIn && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
//           {isLoggedIn && <li><button onClick={handleLogout} style={styles.logout}>Logout</button></li>}
//         </ul>
//       </nav>
//     </header>
//   );
// }

// const styles = {
//   header: {
//     background: "#282c34",
//     padding: "1rem",
//     color: "white",
//   },
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   logo: { margin: 0 },
//   links: {
//     listStyle: "none",
//     display: "flex",
//     gap: "1rem",
//     margin: 0,
//     padding: 0,
//   },
//   logout: {
//     background: "transparent",
//     border: "1px solid white",
//     color: "white",
//     padding: "0.25rem 0.5rem",
//     cursor: "pointer",
//   },
// };

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <h2 style={styles.logo}>🎟 Event Booker</h2>
        <ul style={styles.links}>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/user-dashboard">User Dashboard</Link></li>
          <li><Link to="/organiser-dashboard">Organiser Dashboard</Link></li>
          <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    background: "#282c34",
    padding: "1rem",
    color: "white",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { margin: 0 },
  links: {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    margin: 0,
    padding: 0,
  },
};

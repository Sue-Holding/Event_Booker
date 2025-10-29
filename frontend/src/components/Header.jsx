import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const roleLinks = {
    attendee: [
      { name: 'Home', path: 'home' },
      { name: 'Search Events', path: 'search-events' },
      { name: 'My Favourites', path: 'favourites' },
      { name: 'My Booked Events', path: 'booked-events' },
    ],
    organiser: [
      { name: 'Home', path: 'home' },
      { name: 'Search Events', path: 'search-events' },
      { name: 'My Favourites', path: 'favourites' },
      { name: 'My Booked Events', path: 'booked-events' },
      { name: 'My Events', path: 'my-events' },
      { name: 'Add New Event', path: 'events/new' },
    ],
    admin: [
      { name: 'Home', path: 'home' },
      { name: 'Search Events', path: 'search-events' },
      { name: 'My Favourites', path: 'favourites' },
      { name: 'My Booked Events', path: 'booked-events' },
      { name: 'My Events', path: 'my-events' },
      { name: 'Add New Event', path: 'events/new' },
      { name: 'Event Stats', path: 'event-stats' },
      { name: 'User Settings', path: 'user-settings' },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="header"
    >
      <div className="header-left">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ fontSize: '1.5rem' }}>☰</span>
        </div>
        <h2 className="logo">Eventure</h2>
      </div>

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
        <ul className={`links ${menuOpen ? 'show' : ''}`}>
          {user &&
            roleLinks[user.role]?.map((link) => (
              <motion.li key={link.path} whileHover={{ scale: 1.1 }}>
                <Link to={`/dashboard/${link.path}`} onClick={() => setMenuOpen(false)}>
                  {link.name}
                </Link>
              </motion.li>
            ))}

          {user ? (
            <motion.li whileHover={{ scale: 1.1 }}>
              <button onClick={handleLogout} className="nav-link logout-link">
                Logout
              </button>
            </motion.li>
          ) : (
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="/" className="nav-link">
                Login/Register
              </Link>
            </motion.li>
          )}
        </ul>
      </motion.nav>
    </motion.header>
  );
}

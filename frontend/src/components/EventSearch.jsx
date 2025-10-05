import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventCard from "./EventCard";

const API_URL = process.env.REACT_APP_API_URL;

export default function EventSearch() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/event`);
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = events.filter((event) => {
      const titleMatch = event.title.toLowerCase().includes(term);
      const locationMatch = event.location.toLowerCase().includes(term);
      const categoryMatch = event.category.toLowerCase().includes(term);
      const dateMatch = new Date(event.date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(term);
      const categoryFilter = category ? event.category === category : true;
      const dateFilter = date
        ? new Date(event.date).toISOString().split("T")[0] === date
        : true;

      return (
        (titleMatch || locationMatch || categoryMatch || dateMatch) &&
        categoryFilter &&
        dateFilter
      );
    });

    setFilteredEvents(filtered);
  }, [searchTerm, category, date, events]);

  const categories = [...new Set(events.map((event) => event.category))];

  return (
    <motion.div
      className="event-search"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ padding: "2rem" }}
    >
      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Upcoming Events
      </motion.h2>

      <motion.input
        type="text"
        placeholder="Search by title, location, category, or date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        whileFocus={{ scale: 1.03, boxShadow: "0 0 8px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="search-input"
      />

      <div className="filters">
        <motion.select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          whileHover={{ scale: 1.05 }}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </motion.select>

        <motion.input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          whileHover={{ scale: 1.05 }}
          className="filter-date"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p>No events found</p>
      ) : (
        <motion.div
          layout
          className="grid"
          transition={{ layout: { duration: 0.5 } }}
        >
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}



// import { useEffect, useState } from "react";
// import EventCard from "./EventCard";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function EventSearch() {
//   const [events, setEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [category, setCategory] = useState("");
//   const [date, setDate] = useState("");

//   // Fetch events from backend
//   useEffect(() => {
//     const fetchEvents = async () => {
      
//       try {
//         const res = await fetch(`${API_URL}/event`);
//         const data = await res.json();
//         setEvents(data);
//         setFilteredEvents(data);
//       } catch (err) {
//         console.error("Error fetching events:", err);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Filter events on search
//   useEffect(() => {
//     const term = searchTerm.toLowerCase();

//     const filtered = events.filter((event) => {
//       const titleMatch = event.title.toLowerCase().includes(term);
//       const locationMatch = event.location.toLowerCase().includes(term);
//       const categoryMatch = event.category.toLowerCase().includes(term);

//       const dateMatch = new Date(event.date)
//         .toLocaleDateString()
//         .toLowerCase()
//         .includes(term);

//       // extra structured filters
//       const categoryFilter = category ? event.category === category : true;
//       const dateFilter = date ? new Date(event.date).toISOString().split("T")[0] === date : true;

//       return (titleMatch || locationMatch || categoryMatch || dateMatch) &&
//              categoryFilter &&
//              dateFilter;
//     });
     
//     setFilteredEvents(filtered);
//   }, [searchTerm, category, date, events]);

//   const categories = [...new Set(events.map((event) => event.category))];

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Upcoming Events</h2>

//       {/* main search */}
//       <input
//         type="text"
//         placeholder="Search by title, location, category, or date..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
//       />

//       {/* Category dropdown */}
//       <select
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         style={{ padding: "0.5rem", marginRight: "1rem" }}
//       >
//         <option value="">All Categories</option>
//         {categories.map((cat) => (
//           <option key={cat} value={cat}>{cat}</option>
//         ))}
//       </select>

//       {/* Date picker */}
//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         style={{ padding: "0.5rem" }}
//       />

//       {/* Results */}
//       {filteredEvents.length === 0 ? (
//         <p>No events found</p>
//       ) : (
//         <div style={styles.grid}>
//           {filteredEvents.map((event) => (
//             <EventCard key={event._id} event={event} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1rem",
//     marginTop: "10px",
//   },
// };
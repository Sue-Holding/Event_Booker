import { useEffect, useState } from "react";
import EventCard from "./EventCard";

const API_URL = process.env.REACT_APP_API_URL;

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/event/categories`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/organiser/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch events");
      setEvents(data);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    const reason = prompt("Please enter a reason for cancellation:");
    if (!reason) return;

    try {
      const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cancelReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel event");

      setMessage("✅ Event cancelled successfully!");
      fetchEvents();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const startEditing = (event) => {
    setEditingEventId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      time: event.time,
      location: event.location,
      category: event.category,
      price: event.price,
      newCategory: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateSubmit = async (eventId) => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        category: formData.newCategory ? formData.newCategory : formData.category,
      };

      const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update event");

      setMessage("✅ Event updated successfully!");
      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Events</h2>
      {message && <p>{message}</p>}
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) =>
            editingEventId === event._id ? (
              <div key={event._id} style={styles.editCard}>
                <h3>Edit Event</h3>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleInputChange}
                  placeholder="Or type a new category"
                />

                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleUpdateSubmit(event._id)}
                    style={styles.button}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingEventId(null)}
                    style={styles.buttonCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={event._id}>
                <EventCard event={event} />
                <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                  <button
                    onClick={() => startEditing(event)}
                    style={styles.button}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleCancel(event._id)}
                    style={styles.buttonCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
  },
  editCard: {
    border: "1px solid #007bff",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#f0f8ff",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
    marginRight: "0.5rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  buttonCancel: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};










// import { useEffect, useState } from "react";

// const API_URL = process.env.REACT_APP_API_URL;

// export default function MyEvents() {
//   const [events, setEvents] = useState([]);
//   const [editingEventId, setEditingEventId] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [categories, setCategories] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchEvents();
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${API_URL}/event/categories`);
//       const data = await res.json();
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Failed to fetch categories", err);
//     }
//   };
    
//   const fetchEvents = async () => {
//     try {
//       const res = await fetch(`${API_URL}/organiser/events`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch events");
//       setEvents(data);
//     } catch (err) {
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleCancel = async (eventId) => {
//     const reason = prompt("Please enter a reason for cancellation:");
//     if (!reason) return;

//     try {
//       const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ cancelReason: reason }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to cancel event");

//       setMessage("✅ Event cancelled successfully!");
//       fetchEvents(); // refresh list
//     } catch (err) {
//       setMessage(`❌ ${err.message}`);
//     }
//   };

//   const startEditing = (event) => {
//     setEditingEventId(event._id);
//     setFormData({
//       title: event.title,
//       description: event.description,
//       date: event.date.slice(0, 10),
//       time: event.time,
//       location: event.location,
//       category: event.category,
//       price: event.price,
//       newCategory: "",
//     });
//   };

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleUpdateSubmit = async (eventId) => {
//     try {
//       const payload = { 
//         ...formData, 
//         price: Number(formData.price),
//         category: formData.newCategory ? formData.newCategory : formData.category,
//       };

//       const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update event");

//       setMessage("✅ Event updated successfully!");
//       setEditingEventId(null);
//       fetchEvents();
//     } catch (err) {
//       setMessage(`❌ ${err.message}`);
//     }
//   };

//   if (loading) return <p>Loading events...</p>;

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>My Events</h2>
//       {message && <p>{message}</p>}
//       {events.length === 0 ? (
//         <p>No events found.</p>
//       ) : (
//         <ul>
//           {events.map((event) => (
//             <li
//               key={event._id}
//               style={{
//                 marginBottom: "1rem",
//                 border: "1px solid #ccc",
//                 padding: "1rem",
//                 borderRadius: "5px",
//               }}
//             >
//               {editingEventId === event._id ? (
//                 <div>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Title"
//                   />
//                   <textarea
//                     type="text"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Description"
//                   />
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleInputChange}
//                   />
//                   <input
//                     type="time"
//                     name="time"
//                     value={formData.time}
//                     onChange={handleInputChange}
//                   />
//                   <input
//                     type="text"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleInputChange}
//                     placeholder="Location"
//                   />
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     placeholder="Price"
//                   />
                  
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>

//                   {/* Optional: type a new category */}
//                   <input
//                     type="text"
//                     name="newCategory"
//                     value={formData.newCategory}
//                     onChange={handleInputChange}
//                     placeholder="Or type a new category"
//                   />

//                   <div>
//                   <button
//                     onClick={() => handleUpdateSubmit(event._id)}
//                     style={{ marginRight: "0.5rem" }}
//                   >
//                     Save
//                   </button>
//                   <button onClick={() => setEditingEventId(null)}>Cancel</button>
//                 </div>
//                 </div>
//               ) : (
//                 <div>
//                   <strong>{event.title}</strong>
//                   <br />
//                   <em>
//                     {new Date(event.date).toLocaleDateString()} {event.time}
//                   </em>
//                   <br />
//                   <span>Description: {event.description}</span>
//                   <br />
//                   <span>Location: {event.location}</span>
//                   <br />
//                   <span>Category: {event.category}</span>
//                   <br />
//                   <span>Price: ${event.price}</span>
//                   <br />
//                   <span>Status: {event.status}</span>
//                   <br />
//                   <button
//                     onClick={() => startEditing(event)}
//                     style={{ marginRight: "0.5rem" }}
//                   >
//                     Update
//                   </button>
//                   <button onClick={() => handleCancel(event._id)}>Cancel</button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

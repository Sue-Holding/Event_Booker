import { useEffect, useState, useRef } from "react";
import EventCard from "./EventCard";
import "../styles/MyEvents.css";
import "../styles/styles.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();
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
      setEvents(Array.isArray(data) ? data : data.events || []);
      if (!res.ok) throw new Error(data.message || "Failed to fetch events");
      // setEvents(data);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    // alert are you sure you wish to cancel
    const confirmCancel = window.confirm(
      "⚠️ Are you sure wish wish to canccel this event? This cannot be amended later"
    );
    if (!confirmCancel) return;

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

      //auto refresh fetch to show update to new status
      setTimeout(fetchEvents, 500);
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
      setPreviewUrl(event.imageUrl ? `${API_URL}${event.imageUrl}` : null);
      setSelectedFile(null);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Unsupported file type! Please upload PNG, JPEG, JPG, or WEBP.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUpdateSubmit = async (eventId) => {
    try {
      const dataToSend = new FormData();
      Object.entries({
        ...formData,
        price: Number(formData.price),
        category: formData.newCategory
          ? formData.newCategory
          : formData.category,
      }).forEach(([key, value]) => {
        if (value !== "") dataToSend.append(key, value);
      });

      if (selectedFile) dataToSend.append("image", selectedFile);

  // const handleUpdateSubmit = async (eventId) => {
  //   try {
  //     const payload = {
  //       ...formData,
  //       price: Number(formData.price),
  //       category: formData.newCategory ? formData.newCategory : formData.category,
  //     };

      const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
        method: "PUT",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
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
  <div className="my-events-container">
    <h2>My Events</h2>
    {message && <p>{message}</p>}
    {events.length === 0 ? (
      <p>No events found.</p>
    ) : (
      <div className="event-grid">
        {events.map((event) =>
          editingEventId === event._id ? (
            // --- EDIT MODE ---
            <div key={event._id} className="event-card-wrapper">
              <h3>Edit Event</h3>
              
              <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <input
                      list="category-options"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                    <datalist id="category-options">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* File Upload */}
                <div
                  className="form-group file-dropzone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <label>Event Image</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  {previewUrl && (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
                  <p className="dropzone-text">
                    Drag & drop an image here, or click to select a new file.
                  </p>
                </div>

              <div className="event-card-actions">
                <button
                  onClick={() => handleUpdateSubmit(event._id)}
                  className="btn-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingEventId(null)}
                  className="btn-danger"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // --- VIEW MODE ---
            <div key={event._id} className="event-card-wrapper">
              <EventCard event={event} showDetailsButton={true} />

              {/* if event status = "cancelled" or "rejected" read-only */}
              {event.status === "cancelled" || event.status === "rejected" ? (
                <p className="cancelled-label">
                  This event has been cancelled or rejected.
                </p>
              ) : (
                <div className="event-card-actions">
                  <button
                    onClick={() => startEditing(event)}
                    className="btn-primary"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleCancel(event._id)}
                    className="btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    )}
  </div>
)
}


// return (
//   <div className="my-events-container">
//     <h2>My Events</h2>
//     {message && <p>{message}</p>}
//     {events.length === 0 ? (
//       <p>No events found.</p>
//     ) : (
//       <div className="event-grid">
//         {events.map((event) =>
//           editingEventId === event._id ? (
//             // --- EDIT MODE ---
//             <div key={event._id} className="event-card-wrapper">
//               <h3>Edit Event</h3>

//               {/* <div className="event-card-actions">
//                 <button
//                   onClick={() => handleUpdateSubmit(event._id)}
//                   className="btn-primary"
//                 > */}
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setEditingEventId(null)}
//                   className="btn-danger"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           ) : (
//             // --- VIEW MODE ---
//             <div key={event._id} className="event-card-wrapper">
//               <EventCard event={event} showDetailsButton={true} />

//               {/* if event status = "cancelled" or "rejected" read-only */}
//               {event.status === "cancelled" || event.status === "rejected" ? (
//                 <p className="cancelled-label">
//                   This event has been cancelled or rejected.
//                 </p>
//               ) : (
//                 <div className="event-card-actions">
//                   <button
//                     onClick={() => startEditing(event)}
//                     className="btn-primary"
//                   >
//                     Update
//                   </button>
//                   <button
//                     onClick={() => handleCancel(event._id)}
//                     className="btn-danger"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           )
//         )}
//       </div>
//     )}
//   </div>
// )
// }
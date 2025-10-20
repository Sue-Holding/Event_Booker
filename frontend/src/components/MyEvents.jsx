import { useEffect, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
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
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    const confirmCancel = window.confirm(
      "⚠️ Are you sure you wish to cancel this event? This cannot be undone."
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
      date: event.date?.slice(0, 10),
      time: event.time,
      location: event.location,
      price: event.price,
      category: event.category,
      organiserComment: "",
      image: null,
      imagePreview: event.imageUrl ? `${API_URL}${event.imageUrl}` : null,
    });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Dropzone Setup ---
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: { "image/*": [] },
  onDrop: (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file, // Multer expects the file field to be named "image"
        imagePreview: URL.createObjectURL(file),
      }));
    }
  },
});

// --- Update Event ---
const handleUpdateSubmit = async (eventId) => {
  try {
    const dataToSend = new FormData();

    // Append only non-file fields
    for (const [key, value] of Object.entries(formData)) {
      if (key !== "image" && value !== undefined && value !== null) {
        dataToSend.append(key, value);
      }
    }

    // Append the image last, under the key "image"
    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: dataToSend,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update event");

    setMessage("✅ Event updated and sent for admin review!");
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
              <div key={event._id} className="event-card-wrapper edit-mode">
                <h3>Edit Event</h3>

                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time || ""}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  placeholder="Location"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  placeholder="Price"
                />

                <input
                  list="category-options"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  placeholder="Category"
                />
                <datalist id="category-options">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>

                <textarea
                  name="organiserComment"
                  value={formData.organiserComment || ""}
                  onChange={handleInputChange}
                  placeholder="Comment for admin (e.g. 'Time changed')"
                />

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`file-dropzone ${isDragActive ? "drag-over" : ""}`}
                >
                  <input {...getInputProps()} />
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  ) : (
                    <p>Drag & drop an image here, or click to select a file</p>
                  )}
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
                <div className="card-inner">
                <EventCard event={event} showDetailsButton={true} />

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
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
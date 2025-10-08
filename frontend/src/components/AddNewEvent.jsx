import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import "../styles/addEvent.css"; // 👈 new stylesheet

const API_URL = process.env.REACT_APP_API_URL;

export default function AddNewEvent() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // not logged in
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      if (decoded.role !== "organiser" && decoded.role !=="admin") {
        navigate("/"); // redirect non-organisers
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    price: "",
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/event/categories`);
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      let dateTime = formData.date;
      if (formData.time) {
        dateTime = new Date(`${formData.date}T${formData.time}`);
      }

      const payload = {
        ...formData,
        date: dateTime,
        price: Number(formData.price),
      };

      const res = await fetch(`${API_URL}/organiser/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create event");

      setMessage("✅ Event posted successfully to Admin for review!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        price: "",
      });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="add-event-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="form-title">Add a New Event</h2>
      {message && <p className="form-message">{message}</p>}

      <form className="add-event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title*</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date*</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Time*</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Location*</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              list="category-options"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Select or type a category"
            />
            <datalist id="category-options">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <motion.button
          type="submit"
          className="submit-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Creating..." : "✨ Create Event"}
        </motion.button>
      </form>
    </motion.div>
  );
}
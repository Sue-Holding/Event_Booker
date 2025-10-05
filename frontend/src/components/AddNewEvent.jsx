import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function AddNewEvent() {
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

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/event/categories`); // backend endpoint to get all categories
        const data = await res.json();
        setCategories(data.categories || []); // expected format: { categories: ["sport", "music", "kids"] }
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

      // Combine date and time into a single ISO string
    let dateTime = formData.date;
    if (formData.time) {
      dateTime = new Date(`${formData.date}T${formData.time}`);
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      date: dateTime,  // this is now a proper Date object
      time: formData.time, // store separately if needed
      location: formData.location,
      category: formData.category,
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

      setMessage("✅ Event created successfully!");
      setFormData({ 
        title: "", 
        description: "", 
        date: "", 
        time: "", 
        location: "", 
        category: "",
        price: ""});
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add a New Event</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title*</label><br/>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Description</label><br/>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div>
          <label>Date*</label><br/>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div>
          <label>Time*</label><br/>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>

        <div>
          <label>Location*</label><br/>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div>
          <label>Price</label><br/>
          <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" />
        </div>

        <div>
          <label>Category</label><br/>
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import EventForm from "./EventForm";
import { resizeImage } from "../utils/resizeImage";
// import ImageDropZone from "./ImageDropZone";
import "../styles/addEvent.css";
import '../styles/button.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function AddNewEvent() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  // const [formData, setFormData] = useState({
  //   title: "",
  //   description: "",
  //   date: "",
  //   time: "",
  //   location: "",
  //   category: "",
  //   price: "",
  // });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // const fileInputRef = useRef();

  // check user role
  useEffect(() => {
  const token = localStorage.getItem("token");
    if (!token) return navigate("/");

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

  // fetch categories
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

  const handleAddSubmit = async (formData) => {
    setLoading(true);
    setMessage("");
  // const handleChange = (e) => {
  //   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  // file input handler with resize image
//   const handleFileChange = async (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
//     if (!validTypes.includes(file.type)) {
//       alert("Unsupported file type! Please upload PNG, JPEG, JPG, GIF, or WEBP.");
//       return;
//     }

//     try {
//       const resized = await resizeImage(file, 800, 600, 0.8);
//       setSelectedFile(resized);
//       setPreviewUrl(URL.createObjectURL(resized));
//     } catch (err) {
//       console.error("Image resize failed:", err);
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   }
// };

//   // drag and drop for file upload
//   const handleDrop = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const files = e.dataTransfer?.files;
//     if (!files || files.length ===0) return;

//     const file = files[0];

//     // check file type
//     const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
//     if (!validTypes.includes(file.type)) {
//       alert("Unsupported file type! Please upload PNG, JPEG, JPG, GID or WEBP.");
//       return;
//     }

//     try {
//       const resized = await resizeImage(file, 800, 600, 0.8);
//       setSelectedFile(resized);
//       setPreviewUrl(URL.createObjectURL(resized));
//     } catch (err) {
//       console.error("Image resize failed:", err);
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleDragOver = (e) => e.preventDefault();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

    try {
      const token = localStorage.getItem("token");

      let dateTime = formData.date;
      if (formData.time) dateTime = new Date(`${formData.date}T${formData.time}`);

      // user FormData for image upload
      const dataToSend = new FormData();
      Object.entries({ ...formData, 
                      date: dateTime, 
                      price: Number(formData.price) }).forEach(
        ([key, value]) => {
        if (value !== "") dataToSend.append(key,value);
        }
      );

      if (formData.image) dataToSend.append("image", formData.image);
      // if (selectedFile) dataToSend.append("image", selectedFile);

      const res = await fetch(`${API_URL}/organiser/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create event");

      setMessage("✅ Event posted successfully to Admin for review!");
      // setFormData({
      //   title: "",
      //   description: "",
      //   date: "",
      //   time: "",
      //   location: "",
      //   category: "",
      //   price: "",
      // });
      // setSelectedFile(null);
      // setPreviewUrl(null);
      // fileInputRef.current.value = null;
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

      <EventForm
        initialData={{}}
        categories={categories}
        onSubmit={handleAddSubmit}
        loading={loading}
        submitLabel="✨ Create Event"
      />

      {/* <form className="add-event-form" onSubmit={handleSubmit}>
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

        {/* upload file & drag and drop*/}
        {/* <div className="form-group">
        <label>Event Image</label>
        <ImageDropZone
          defaultPreview={previewUrl}
          onFileSelect={(file) => {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
          }}
        />
        </div>
          
        <motion.button
          type="submit"
          className="button button--primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? "Creating..." : "✨ Create Event"}
        </motion.button>
      </form> */} 
    </motion.div>
  );
}
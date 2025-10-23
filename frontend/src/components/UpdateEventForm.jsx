// form sent to organiser after pending event comes back with comments for updates
import { useState } from "react";
import '../styles/button.css';
import "../styles/UpdateEventForm.css";
import ImageDropZone from "./ImageDropZone";

export default function UpdateEventForm({ event, onUpdate }) {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: event.date.slice(0, 10),
    time: event.time,
    location: event.location,
    category: event.category,
    price: event.price,
    newCategory: "",
    organiserComment: "",
    image: null, // optional image upload
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      category: formData.newCategory ? formData.newCategory : formData.category,
    };

    onUpdate(event._id, payload);
    setMessage("✅ Changes submitted! Waiting for admin approval.");
  };

  return (
    <div className="update-form-card">
      <h3 className="update-form-title">Edit Event: {event.title}</h3>

      {/* Show latest admin comment */}
      {event.adminComments?.length > 0 && (
        <p className="admin-feedback">
          <strong>Admin comment:</strong>{" "}
          {event.adminComments[event.adminComments.length - 1].text}
        </p>
      )}

      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit} className="update-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <input
          type="text"
          name="newCategory"
          value={formData.newCategory}
          onChange={handleChange}
          placeholder="Or type a new category"
        />

        {/* Image upload via reusable dropzone */}
        <ImageDropZone
          defaultPreview={formData.imagePreview}
          onFileSelect={(file) => setFormData((p) => ({ ...p, image: file }))}
        />

        <textarea
          name="organiserComment"
          value={formData.organiserComment}
          onChange={handleChange}
          placeholder="Add a short note for the admin (e.g., 'Updated images and fixed description.')"
        />

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            Save & Submit
          </button>
        </div>
      </form>
    </div>
  );
}



// import { useState } from "react";
// import '../styles/button.css';
// import "../styles/UpdateEventForm.css";
// import ImageDropZone from "./ImageDropZone";

// export default function UpdateEventForm({ event, onUpdate }) {
//   const [formData, setFormData] = useState({
//     title: event.title,
//     description: event.description,
//     date: event.date.slice(0, 10),
//     time: event.time,
//     location: event.location,
//     category: event.category,
//     price: event.price,
//     newCategory: "",
//     organiserComment: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       price: Number(formData.price),
//       category: formData.newCategory
//         ? formData.newCategory
//         : formData.category,
//     };

//     onUpdate(event._id, payload);
//     setMessage("✅ Changes submitted! Waiting for admin approval.");
//   };

//   return (
//       <div className="update-form-card">
//       <h3 className="update-form-title">Edit Event: {event.title}</h3>

//         {/* show admin comment */}
//       {event.adminComment && (
//           <p className="admin-feedback">
//           <strong>Admin comment:</strong>{" "}
//           {/* {event.adminComment} */}
//           {event.adminComments[event.adminComments.length - 1].text}
//         </p>
//       )}

//       {message && <p className="success-message">{message}</p>}

//       <form onSubmit={handleSubmit} className="update-form">
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Title"
//           required
//         />

//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Description"
//         />

//         <div className="grid grid-cols-2 gap-3">
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="time"
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//           />
//         </div>

//         <input
//           type="text"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           placeholder="Location"
//           required
//         />

//         <input
//           type="number"
//           name="price"
//           value={formData.price}
//           onChange={handleChange}
//           placeholder="Price"
//         />

//         <input
//           type="text"
//           name="newCategory"
//           value={formData.newCategory}
//           onChange={handleChange}
//           placeholder="Or type a new category"
//         />

//         <ImageDropZone onFileSelect={(file) => setFormData((p) => ({ ...p, image: file }))} />

//         {/* organiser comment box */}
//         <textarea
//           name="organiserComment"
//           value={formData.organiserComment}
//           onChange={handleChange}
//           placeholder="Add a short note for the admin (e.g., 'Updated images and fixed description.')"
//         />
      
//         <div className="form-actions">
//           <button type="submit" className="button button--primary">
//             Save & Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// form sent to organiser after pending event comes back with comments for updates
import { useState } from "react";

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
      category: formData.newCategory
        ? formData.newCategory
        : formData.category,
    };

    onUpdate(event._id, payload);
    setMessage("✅ Changes submitted! Waiting for admin approval.");
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 max-w-2xl mx-auto mt-4 overflow-auto max-h-[80vh]">
      <h4 className="text-xl font-semibold mb-2 text-gray-800">
        Edit Event: {event.title}
      </h4>

        {/* show admin comment */}
      {event.adminComment && (
        <p className="bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 p-3 rounded mb-3">
          <strong>Admin comment:</strong> 
          {/* {event.adminComment} */}
          {event.adminComments[event.adminComments.length - 1].text}
        </p>
      )}

      {message && (
        <p className="text-green-600 font-medium mb-3">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-gray-700"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border rounded-lg p-2 min-h-[100px] focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          name="newCategory"
          value={formData.newCategory}
          onChange={handleChange}
          placeholder="Or type a new category"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500"
        />

        {/* organiser comment box */}
        <textarea
          name="organiserComment"
          value={formData.organiserComment}
          onChange={handleChange}
          placeholder="Add a short note for the admin (e.g., 'Updated images and fixed description.')"
          className="border rounded-lg p-2 min-h-[80px] focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500"
        />
        
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Save & Submit
          </button>
        </div>
      </form>
    </div>
  );
}



// import { useState } from "react";

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
//       category: formData.newCategory ? formData.newCategory : formData.category,
//     };

//     onUpdate(event._id, payload);
//     setMessage("✅ Changes submitted! Waiting for admin approval.");
//   };

//   return (
//     <div className="event-card-wrapper">
//       <h4>Edit Event: {event.title}</h4>
//       {event.adminComment && (
//         <p className="admin-comment">
//           <strong>Admin comment:</strong> {event.adminComment}
//         </p>
//       )}
//       {message && <p className="success-message">{message}</p>}

//       <form onSubmit={handleSubmit} className="update-event-form">
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
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="time"
//           name="time"
//           value={formData.time}
//           onChange={handleChange}
//         />
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

//         <div className="event-card-actions">
//           <button type="submit" className="btn-primary">
//             Save & Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageDropZone from './ImageDropZone';
import '../styles/addEvent.css';
import '../styles/button.css';

export default function EventForm({
  initialData = {},
  categories = [],
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    organiserComment: '',
    image: null,
    imagePreview: null,
    ...initialData,
  });

  useEffect(() => {
    if (initialData.imagePreview) {
      setFormData((prev) => ({ ...prev, imagePreview: initialData.imagePreview }));
    }
  }, [initialData.imagePreview]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileSelect = (file) => {
    setFormData((prev) => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      className="add-event-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="form-group">
        <label htmlFor="title">Title*</label>
        <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor='description'>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor='date'>Date*</label>
          <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor='time'>Time*</label>
          <input id="time" type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor='location'>Location*</label>
        <input
          id="location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor='price'>Price</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor='category'>Category</label>
          <input
            id="category"
            type="text"
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

      {formData.organiserComment !== undefined && (
        <div className="form-group">
          <label>Comment for Admin</label>
          <textarea
            name="organiserComment"
            value={formData.organiserComment}
            onChange={handleChange}
          />
        </div>
      )}

      <ImageDropZone defaultPreview={formData.imagePreview} onFileSelect={handleFileSelect} />

      <motion.button
        type="submit"
        style={{ marginBottom: '1.5rem' }}
        className="button button--primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
      >
        {loading ? 'Saving...' : submitLabel}
      </motion.button>
    </motion.form>
  );
}

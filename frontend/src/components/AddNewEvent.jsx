import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import EventForm from './EventForm';
import '../styles/addEvent.css';
import '../styles/button.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function AddNewEvent() {
  const navigate = useNavigate();
  // const [userRole, setUserRole] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // check user role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    try {
      const decoded = jwtDecode(token);
      // setUserRole(decoded.role);
      if (decoded.role !== 'organiser' && decoded.role !== 'admin') {
        navigate('/'); // redirect non-organisers
      }
    } catch {
      localStorage.removeItem('token');
      navigate('/');
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
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddSubmit = async (formData) => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      let dateTime = formData.date;
      if (formData.time) dateTime = new Date(`${formData.date}T${formData.time}`);

      // user FormData for image upload
      const dataToSend = new FormData();
      Object.entries({ ...formData, date: dateTime, price: Number(formData.price) }).forEach(
        ([key, value]) => {
          if (value !== '') dataToSend.append(key, value);
        },
      );

      if (formData.image) dataToSend.append('image', formData.image);

      const res = await fetch(`${API_URL}/organiser/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create event');

      setMessage('✅ Event posted successfully to Admin for review!');
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
    </motion.div>
  );
}

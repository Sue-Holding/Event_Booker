import { useEffect, useState, useCallback } from "react";
import EventForm from "./EventForm"; // use the new form
import CommentThread from "./CommentThread";
import '../styles/button.css';

export default function UpdatesRequired() {
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const token = localStorage.getItem("token");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/organiser/events?status=needs-update`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const startEditing = (event) => setEditingEventId(event._id);

  const handleUpdate = async (eventId, updatedData) => {
    try {
      const dataToSend = new FormData();
      Object.entries({ ...updatedData, status: "pending" }).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== null) dataToSend.append(key, value);
        }
      );

      await fetch(`${API_URL}/organiser/events/${eventId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });

      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    }
  };

  return (
    <div>
      <h2 className="title">Updates Required</h2>
      {events.length === 0 && <p>No updates required.</p>}
      {events.map((event) =>
        editingEventId === event._id ? (
          <EventForm
            key={event._id}
            initialData={{
              ...event,
              date: event.date?.slice(0, 10),
              organiserComment: "", // optional note for admin
            }}
            categories={[]} // optionally fetch categories if needed
            onSubmit={(updatedData) => handleUpdate(event._id, updatedData)}
            submitLabel="Save & Submit"
          />
        ) : (
          <div key={event._id} className="comment-thread">
            <h3 className="comment-thread-title">{event.title}</h3>

            <CommentThread comments={event.adminComments} />

            <button
              className="button button--warning"
              onClick={() => startEditing(event)}
            >
              Edit & Submit
            </button>
          </div>
        )
      )}
    </div>
  );
}

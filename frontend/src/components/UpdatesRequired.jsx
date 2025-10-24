import { useEffect, useState, useCallback } from "react";
import EventForm from "./EventForm";
import CommentThread from "./CommentThread";
import "../styles/button.css";
import "../styles/PendingEvents.css"; // reuse same styles for consistency

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

  const handleUpdate = async (eventId, updatedData) => {
    try {
      const dataToSend = new FormData();
      Object.entries({ ...updatedData, status: "pending" }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) dataToSend.append(key, value);
      });

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
    <div className="event-page">
      <h2 className="title">Updates Required</h2>
      <h3>Events ({events.length})</h3>

      {events.length === 0 ? (
        <p>No events needing updates.</p>
      ) : (
        events.map((event) =>
          editingEventId === event._id ? (
            <EventForm
              key={event._id}
              initialData={{
                ...event,
                date: event.date?.slice(0, 10),
                organiserComment: "",
              }}
              categories={[]}
              onSubmit={(updatedData) => handleUpdate(event._id, updatedData)}
              submitLabel="Save & Submit"
            />
          ) : (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p><strong>Status:</strong> {event.status}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Price:</strong> {event.price} SEK</p>
              <p><strong>Description:</strong> {event.description}</p>

              <CommentThread comments={event.adminComments} />

              <button
                className="button button--warning"
                onClick={() => setEditingEventId(event._id)}
              >
                ✏️ Edit & Resubmit
              </button>
            </div>
          )
        )
      )}
    </div>
  );
}

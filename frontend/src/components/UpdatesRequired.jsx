import { useEffect, useState, useCallback } from "react";
import UpdateEventForm from "./UpdateEventForm";
import CommentThread from "./CommentThread";

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
    //   setEvents(data?.events || []);
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  }, [API_URL, token]);

  // fetch on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);;

  const startEditing = (event) => setEditingEventId(event._id);

  const handleUpdate = async (eventId, updatedData) => {
    try {
    await fetch(`${API_URL}/organiser/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...updatedData, status: "pending" }),
    });

    // refresh list & remove updated events from list
    // setEvents(events.filter(e => e._id !== eventId));
    setEditingEventId(null);

    fetchEvents();
  } catch (err) {
    console.error(err);
    alert("Failed to update event");
  }
};

return (
  <div>
    <h3>Updates Required</h3>
    {events.length === 0 && <p>No updates required.</p>}
    {events.map((event) =>
      editingEventId === event._id ? (
        <UpdateEventForm
          key={event._id}
          event={event}
          onUpdate={handleUpdate}
        />
      ) : (
        <div key={event._id} className="event-card">
          <h4>{event.title}</h4>

          {/* 👇 Threaded chat between admin & organiser */}
          <CommentThread comments={event.adminComments} />

          <button onClick={() => startEditing(event)}>Edit & Submit</button>
        </div>
      )
    )}
  </div>
);

//   return (
//     <div>
//       <h3>Updates Required</h3>
//       {events.length === 0 && <p>No updates required.</p>}
//       {events.map((event) =>
//         editingEventId === event._id ? (
//           <UpdateEventForm key={event._id} event={event} onUpdate={handleUpdate} />
//         ) : (
//           <div key={event._id} className="event-card">
//             <h4>{event.title}</h4>
//             <p><strong>Comment:</strong> {event.adminComment}</p>
//             <button onClick={() => startEditing(event)}>Edit & Submit</button>
//           </div>
//         )
//       )}
//     </div>
//   );
};

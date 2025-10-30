import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import SmallEventCard from './SmallEventCard';
import EventForm from './EventForm';
import useViewport from '../hooks/useViewport';
import '../styles/MyEvents.css';
import '../styles/styles.css';
import '../styles/button.css';
import '../styles/grid.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function MyEvents() {
  const { isMobile, isTablet } = useViewport();
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const [expandedId, setExpandedId] = useState(null);

  // useEffect(() => {
  //   const fetchAll = async () => {
  //     await fetchEvents();
  //     await fetchCategories();
  //   };

  //   fetchAll();
  // }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // fetch events
        const resEvents = await fetch(`${API_URL}/organiser/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataEvents = await resEvents.json();
        setEvents(Array.isArray(dataEvents) ? dataEvents : dataEvents.events || []);

        // fetch categories
        const resCats = await fetch(`${API_URL}/event/categories`);
        const dataCats = await resCats.json();
        setCategories(dataCats.categories || []);

        setLoading(false);
      } catch (err) {
        setMessage(`❌ ${err.message}`);
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  // const fetchCategories = async () => {
  //   try {
  //     const res = await fetch(`${API_URL}/event/categories`);
  //     const data = await res.json();
  //     setCategories(data.categories || []);
  //   } catch (err) {
  //     console.error('Failed to fetch categories', err);
  //   }
  // };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/organiser/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
      if (!res.ok) throw new Error(data.message || 'Failed to fetch events');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCardToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCancel = async (eventId) => {
    const confirmCancel = window.confirm(
      '⚠️ Are you sure you wish to cancel this event? This cannot be undone.',
    );
    if (!confirmCancel) return;

    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason) return;

    try {
      const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cancelReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel event');

      setMessage('✅ Event cancelled successfully!');
      setTimeout(fetchEvents, 500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleUpdateSubmit = async (eventId, updatedData) => {
    try {
      const dataToSend = new FormData();

      // for (const [key, value] of Object.entries(updatedData)) {
      //   if (value !== undefined && value !== null) {
      //     dataToSend.append(key, value);
      //   }
      // }
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          dataToSend.append(key, value);
        }
      });

      const res = await fetch(`${API_URL}/organiser/events/${eventId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update event');

      setMessage('✅ Event updated and sent for admin review!');
      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="">
      <h2 className="title">My Events</h2>
      {message && <p>{message}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div
          className={`
          ${isMobile || isTablet ? 'small-grid' : 'event-grid'}
          ${editingEventId ? 'editing' : ''}
        `}
        >
          {events.map((event) => {
            const isEditing = editingEventId === event._id;

            if (isMobile || isTablet) {
              return (
                <SmallEventCard
                  key={event._id}
                  event={event}
                  isExpanded={expandedId === event._id || isEditing}
                  fullExpand={isEditing}
                  onToggle={() => handleCardToggle(event._id)}
                >
                  {isEditing ? (
                    <>
                      <EventForm
                        initialData={{
                          ...event,
                          date: event.date?.slice(0, 10),
                          organiserComment: '',
                        }}
                        categories={categories}
                        onSubmit={(updatedData) => handleUpdateSubmit(event._id, updatedData)}
                        submitLabel="Save & Submit"
                      />
                      <button
                        onClick={() => setEditingEventId(null)}
                        className="button button--warning"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {event.status === 'cancelled' || event.status === 'rejected' ? (
                        <p className="cancelled-label">
                          This event has been cancelled or rejected.
                        </p>
                      ) : (
                        <div className="card-footer">
                          <button
                            onClick={() => setEditingEventId(event._id)}
                            className="button button--primary"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleCancel(event._id)}
                            className="button button--warning"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </SmallEventCard>
              );
            }
            return (
              <EventCard
                key={event._id}
                event={event}
                showDetailsButton
                isExpanded={expandedId === event._id || isEditing}
                fullExpand={isEditing}
              >
                {isEditing ? (
                  <>
                    <EventForm
                      initialData={{
                        ...event,
                        date: event.date?.slice(0, 10),
                        organiserComment: '',
                      }}
                      categories={categories}
                      onSubmit={(updatedData) => handleUpdateSubmit(event._id, updatedData)}
                      submitLabel="Save & Submit"
                    />
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="button button--warning"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {event.status === 'cancelled' || event.status === 'rejected' ? (
                      <p className="cancelled-label">This event has been cancelled or rejected.</p>
                    ) : (
                      <div className="card-footer">
                        <button
                          onClick={() => setEditingEventId(event._id)}
                          className="button button--primary"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleCancel(event._id)}
                          className="button button--warning"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                )}
              </EventCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

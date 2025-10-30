import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import SmallEventCard from './SmallEventCard';
import useViewport from '../hooks/useViewport';
import '../styles/EventStats.css';
import '../styles/button.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function EventStats() {
  const { isMobile, isTablet } = useViewport();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchOrganizer, setSearchOrganizer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [eventComments, setEventComments] = useState({});

  const token = localStorage.getItem('token');

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch events');

      const data = await res.json();
      setEvents(data.events);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAction = async (id, action, comment) => {
    try {
      const res = await fetch(`${API_URL}/admin/events/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, comment }),
      });

      if (!res.ok) throw new Error('Action failed');

      await fetchEvents(); // refresh data
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  // filter events by status and organizer
  useEffect(() => {
    let filtered = events;

    if (searchOrganizer) {
      filtered = filtered.filter((e) =>
        e.organizer?.name?.toLowerCase().includes(searchOrganizer.toLowerCase()),
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [searchOrganizer, filterStatus, events]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <motion.div>
      <motion.div
        className="event-stats-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Stats Section */}
        <section>
          <h3>📊 Stats</h3>
          <ul className="stats-list">
            <li>Total Events: {stats.totalEvents}</li>
            <li>Free Events: {stats.freeEvents}</li>
            <li>Approved: {stats.approved}</li>
            <li>Pending: {stats.pending}</li>
            <li>Rejected: {stats.rejected}</li>
            <li>Cancelled: {stats.cancelled}</li>
          </ul>
        </section>

        {/* Filters */}
        <section className="filters">
          <input
            type="text"
            placeholder="Search by organizer..."
            value={searchOrganizer}
            onChange={(e) => setSearchOrganizer(e.target.value)}
          />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="needs-update">Needs Update</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </section>
      </motion.div>

      {/* Event List */}
      <motion.div>
        <section>
          <h2 className="title">Events ({filteredEvents.length})</h2>

          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className={isMobile || isTablet ? 'small-grid' : 'event-grid'}>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event._id}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ duration: 0.3 }}
                  className="event-wrapper"
                >
                  {isMobile || isTablet ? (
                    <SmallEventCard event={event}>
                      <Link
                        to={`/admin-dashboard/events/${event._id}`}
                        className="button button--primary"
                      >
                        View Event
                      </Link>

                      {event.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(event._id, 'approve')}
                            className="button button--primary"
                          >
                            ✅ Approve
                          </button>

                          <input
                            type="text"
                            placeholder="Short comment..."
                            value={eventComments[event._id] || ''}
                            onChange={(e) =>
                              setEventComments((prev) => ({
                                ...prev,
                                [event._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="button button--warning"
                            onClick={() =>
                              handleAction(
                                event._id,
                                'needs-update',
                                eventComments[event._id] || 'Please fix details',
                              )
                            }
                          >
                            ✏️ Needs Update
                          </button>

                          <button
                            className="button button--danger"
                            onClick={() => handleAction(event._id, 'reject', 'Not suitable')}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </SmallEventCard>
                  ) : (
                    <EventCard event={event}>
                      {event.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(event._id, 'approve')}
                            className="button button--primary"
                          >
                            ✅ Approve
                          </button>

                          <input
                            type="text"
                            placeholder="Short comment..."
                            value={eventComments[event._id] || ''}
                            onChange={(e) =>
                              setEventComments((prev) => ({
                                ...prev,
                                [event._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="button button--warning"
                            onClick={() =>
                              handleAction(
                                event._id,
                                'needs-update',
                                eventComments[event._id] || 'Please fix details',
                              )
                            }
                          >
                            ✏️ Needs Update
                          </button>

                          <button
                            className="button button--danger"
                            onClick={() => handleAction(event._id, 'reject', 'Not suitable')}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </EventCard>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </motion.div>
  );
}

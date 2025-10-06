import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function EventStats() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchOrganizer, setSearchOrganizer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [eventComments, setEventComments] = useState({});


  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      setEvents(data.events);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAction = async (id, action, comment) => {
    try {
      const res = await fetch(`${API_URL}/admin/events/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, comment }),
      });

      if (!res.ok) throw new Error("Action failed");

      await fetchEvents(); // refresh data
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  // filter events by status and organizer
  useEffect(() => {
    let filtered = events;

    if (searchOrganizer) {
      filtered = filtered.filter((e) =>
        e.organizer?.name
          ?.toLowerCase()
          .includes(searchOrganizer.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [searchOrganizer, filterStatus, events]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      {/* <h2>Admin Event Dashboard</h2> */}

      <section style={{ marginBottom: "1.5rem" }}>

        {/* stats part */}
        <h3>📊 Stats</h3>
        <ul>
          <li>Total Events: {stats.totalEvents}</li>
          <li>Free Events: {stats.freeEvents}</li>
          <li>Approved: {stats.approved}</li>
          <li>Pending: {stats.pending}</li>
          <li>Rejected: {stats.rejected}</li>
          <li>Cancelled: {stats.cancelled}</li>
        </ul>
      </section>

      {/* filter events */}
      <section
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Search by organizer..."
          value={searchOrganizer}
          onChange={(e) => setSearchOrganizer(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flex: 1,
          }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="needs-update">Needs Update</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </section>

      {/* event list */}
      <section>
        <h3>📅 Events ({filteredEvents.length})</h3>
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h4>{event.title}</h4>
              <p>
                <strong>Status:</strong> {event.status}
              </p>
              <p>
                <strong>Organizer:</strong> {event.organizer?.name} (
                {event.organizer?.email})
              </p>
              <p>
                <strong>Price:</strong> {event.price} SEK
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Description:</strong> {event.description}
              </p>
              {event.adminComment && (
                <p>
                  <strong>Notes for update:</strong> {event.adminComment}
                </p>
              )}

              <Link to={`/admin-dashboard/events/${event._id}`} 
                style={{ 
                  textDecoration: "none",
                  color: "white",
                  background: "#007bff",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  marginRight: "0.5rem" 
                  }}>
                View Event
              </Link>

              {event.status === "pending" && (
                <div style={{ marginTop: "1rem" }}>

                  {/* approve button */}
                  <button
                    onClick={() => handleAction(event._id, "approve")}
                    style={{ marginRight: "0.5rem" }}
                  >
                    ✅ Approve
                  </button>

                  {/* needs update button */}
                  <input
                    type="text"
                    placeholder="Short comment..."
                    value={eventComments[event._id] || ""}
                    onChange={(e) =>
                      setEventComments((prev) => ({ ...prev, [event._id]: e.target.value }))
                    }
                    style={{ marginRight: "0.5rem", padding: "0.25rem" }}
                  />
                  <button
                    onClick={() =>
                      handleAction(
                        event._id,
                        "needs-update",
                        eventComments[event._id] || "Please fix details"
                      )
                    }
                    style={{ marginRight: "0.5rem" }}
                  >
                    ✏️ Needs Update
                  </button>

                  {/* reject button */}
                  <button
                    onClick={() =>
                      handleAction(event._id, "reject", "Not suitable")
                    }
                  >
                    ❌ Reject
                  </button>

                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
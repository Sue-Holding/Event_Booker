import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  // fetch all events to display
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5050/event/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  const toggleFavourite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    setLoading(true);
    try {
      const url = `http://localhost:5050/users/favorites/${id}`;
      const method = isFavourite ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setIsFavourite(!isFavourite);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating favourites");
    }
    setLoading(false);
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Back to Search
      </button>

      <h2>{event.title}</h2>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {event.time || "TBA"}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> {event.price === 0 ? "Free" : `${event.price} kr`}</p>
      <p><strong>Description:</strong> {event.description}</p>

      <button
        onClick={toggleFavourite}
        disabled={loading}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        {isFavourite ? "★ Remove from Favourites" : "☆ Add to Favourites"}
      </button>

    </div>
  );
}

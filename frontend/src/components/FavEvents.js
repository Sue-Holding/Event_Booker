import { useEffect, useState } from "react";

export default function FavEvent() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5050/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch favourites");

        setFavorites(data.favorites || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (eventId) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:5050/users/favorites/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to remove favourite");

        // Update local state to reflect removal
        setFavorites((prev) => prev.filter((fav) => fav._id !== eventId));
      } catch (err) {
        console.error(err);
      }
    };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Favourite Events</h2>

      {favorites.length === 0 ? (
        <p>No favourite events yet.</p>
      ) : (
        <ul>
          {favorites.map(event => (
            <li key={event._id} style={{ marginBottom: "1rem" }}>
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.price} SEK</p>

              {/* remove from favourites */}
              <button onClick={() => removeFavorite(event._id)}>
                Remove from favourites
              </button>

            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

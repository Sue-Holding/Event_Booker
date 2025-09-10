import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Grab the user from localStorage (set after login)
    const token = localStorage.getItem("token");
    if (!token) return;

    // Example: decode from backend later — for now, just fake user
    setUser({ name: "Test User", role: "basic" });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Event Booker 🎉</h1>
      {user ? (
        <>
          <p>Hello, {user.name}!</p>
          <p>You are logged in as: <strong>{user.role}</strong></p>
          <button onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/"; // back to login
          }}>
            Logout
          </button>
        </>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  );
}

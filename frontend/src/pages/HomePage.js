import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Grab the user from localStorage (set after login)
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token); // decode the JWT
      // decoded should have your user ID and role (if backend sends it)
      // For example, backend could send { id, name, role } in token
      setUser({ name: decoded.name, role: decoded.role });
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
    }
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

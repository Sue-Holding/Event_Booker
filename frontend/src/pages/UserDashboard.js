// for user / attendee
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // simple decode
      setUser({ name: payload.name, role: payload.role });
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <p>Role: {user.role}</p>
          <h3>Available Events</h3>
          {/* Later: list events */}
        </>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  );
}

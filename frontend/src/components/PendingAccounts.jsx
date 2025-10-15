import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function PendingAccounts() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // Fetch all users
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${API_URL}/admin/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to fetch users");
          }

          const data = await res.json();

          // Filter pending organiser requests
        const pendingOrganisers = data.filter(
        (user) => user.role === "attendee" && user.status === "pending"
            );
            setUsers(pendingOrganisers);
            setError("");
            } catch (err) {
            console.error(err);
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };

        useEffect(() => {
            fetchUsers();
        }, []);
          

      const approveUser = async (id) => {
        console.log("Approving user ID:", id);
        try {
        const res = await fetch(`${API_URL}/admin/approve-organiser/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });

        const data = await res.json();
        console.log("Backend response:", data);
        // console.log(res.status, res.statusText);

        if (!res.ok) {
            throw new Error(data.message || "Action failed");
            }

        alert(data.message);
        await fetchUsers(); // refresh data
        } catch (err) {
        console.error(err);
        alert(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
      <h2 className="title">Pending Organiser Requests</h2>
      {users.length === 0 && <p>No pending requests.</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id} style={{ marginBottom: "1rem" }}>
            <strong>{user.name}</strong> ({user.email})
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => approveUser(user._id)}
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
    );
}
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5050"; // Replace with your backend URL

export default function UserSettings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({ name: "", email: "", role: "" });
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
      setUsers(data);
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

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setUsers([...users, data.user]);
      setFormData({ name: "", email: "", role: "user", password: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditingData({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingData({ name: "", email: "", role: "" });
  };

  const updateUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      setUsers(users.map((user) => (user._id === id ? data.user : user)));
      
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 className="title">User Settings</h2>

      {/* New User Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h3>Create New User</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <select name="role" value={formData.role} onChange={handleChange} style={{ marginRight: "0.5rem" }}>
          <option value="user">User</option>
          <option value="organiser">Organiser</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">Create</button>
      </form>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && users.length === 0 && <p>No users found</p>}

      {users.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUserId === user._id ? (
                    <input
                      value={editingData.name}
                      onChange={(e) => setEditingData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUserId === user._id ? (
                    <input
                      value={editingData.email}
                      onChange={(e) => setEditingData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUserId === user._id ? (
                    <select
                      value={editingData.role}
                      onChange={(e) => setEditingData((prev) => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="user">User</option>
                      <option value="organiser">Organiser</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editingUserId === user._id ? (
                    <>
                      <button onClick={() => updateUser(user._id)} style={{ marginRight: "0.5rem" }}>
                        Save
                      </button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(user)} style={{ marginRight: "0.5rem" }}>
                        Edit
                      </button>
                      <button onClick={() => deleteUser(user._id)} style={{ color: "red" }}>
                        Delete
                      </button>
                      </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
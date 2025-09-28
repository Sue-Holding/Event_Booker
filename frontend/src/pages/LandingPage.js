import { useState } from "react";

export default function LandingPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL;
    
    const endpoint = isLogin ? "login" : "register";

    try {
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage(
        isLogin ? `Welcome back, ${data.name || "User"}!` : "Registration successful!"
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        // window.location.href = "/home"; // redirect to homepage
        // redirect based on role
          if (data.role === "admin") window.location.href = "/admin-dashboard";
          else if (data.role === "organiser") window.location.href = "/organiser-dashboard";
          else window.location.href = "/user-dashboard";
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <br />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        {!isLogin && (
          <>
            <label>
              Role:{" "}
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="attendee">Attendee</option>
                <option value="organiser">Organiser</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </label>
            <br />
          </>
        )}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
      <p>{message}</p>
    </div>
  );
}
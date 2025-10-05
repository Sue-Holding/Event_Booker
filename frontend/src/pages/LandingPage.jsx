import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/landing.css";

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
        isLogin
          ? `Welcome back, ${data.name || "User"}!`
          : "🎉 Registration successful!"
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.role === "admin") window.location.href = "/admin-dashboard";
        else if (data.role === "organiser")
          window.location.href = "/organiser-dashboard";
        else window.location.href = "/user-dashboard";
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="landing-container">
      {/* Left side: image or illustration */}
      <motion.div
        className="landing-hero"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>🎟️ Eventure</h1>
        <p>Discover. Create. Experience.</p>
        <motion.img
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=60"
          alt="Concert crowd"
          className="hero-img"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Right side: login/register form */}
      <motion.div
        className="landing-form"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2>{isLogin ? "Login" : "Create Account"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <motion.input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name || ""}
              onChange={handleChange}
              whileFocus={{ scale: 1.03 }}
              required
            />
          )}

          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            whileFocus={{ scale: 1.03 }}
            required
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            whileFocus={{ scale: 1.03 }}
            required
          />

          {!isLogin && (
            <motion.select
              name="role"
              value={form.role || "attendee"}
              onChange={handleChange}
              whileFocus={{ scale: 1.03 }}
            >
              <option value="attendee">Attendee</option>
              <option value="organiser">Organiser</option>
            </motion.select>
          )}

          <motion.button
            type="submit"
            className="glow-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? "Login" : "Register"}
          </motion.button>
        </form>

        <motion.button
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-button"
          whileHover={{ scale: 1.05 }}
        >
          {isLogin ? "Need an account? Register" : "Already have one? Login"}
        </motion.button>

        {message && <p className="message">{message}</p>}
      </motion.div>
    </div>
  );
}
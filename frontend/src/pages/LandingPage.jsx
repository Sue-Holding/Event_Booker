import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/landing.css";

const images = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80", // food
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80", // concert
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", // kids
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80", // tech
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80", // sports
  "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1200&q=80", // art
];

export default function LandingPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "attendee" });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      setMessage(isLogin ? `Welcome back, ${data.name || "User"}!` : "🎉 Registration successful!");
      
      // Handle messages for pending organiser approval
      if (!isLogin && form.role === "organiser") {
        setMessage(
          "Your organiser registration is pending admin approval. You will log in as attendee until approved."
        );
        return;
      }

      if (!isLogin) {
        setMessage("🎉 Registration successful!");
      } else {
        setMessage(`Welcome back, ${data.name || "User"}!`);
      }

      // loging redirect
      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.role === "admin") window.location.href = "/dashboard";
        else if (data.role === "organiser") window.location.href = "/dashboard";
        else window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="landing-dark">
      {/* Background rotating image cards */}
      <div className="image-carousel">
        <AnimatePresence>
          <motion.div
            key={currentImage}
            className="image-slide"
            style={{ backgroundImage: `url(${images[currentImage]})` }}
            initial={{ opacity: 0, rotate: -5, y: 30 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, rotate: 5, y: -30 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </div>

      {/* Overlay gradient */}
      <div className="overlay-gradient" />

      {/* Centered content */}
      <motion.div
        className="landing-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {!showForm ? (
          <>
            <h1 className="landing-title">Get started with <span>Eventure!</span></h1>
            <motion.button
              className="start-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
            >
              Let's Go →
            </motion.button>
          </>
        ) : (
          <motion.div
            className="landing-form-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2>{isLogin ? "Login" : "Create Account"}</h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input type="text" name="name" placeholder="Full Name" value={form.name || ""} onChange={handleChange} />
              )}
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />

              {!isLogin && (
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="attendee">Attendee</option>
                  <option value="organiser">Organiser</option>
                </select>
              )}

              <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Need an account? Register" : "Already have one? Login"}
            </button>
            {message && <p className="message">{message}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
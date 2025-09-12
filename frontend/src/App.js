import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/organiser-dashboard" element={<OrganiserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
  );
}
export default App;


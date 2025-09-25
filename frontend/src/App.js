import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* User Dashboard */}
        <Route 
          path="/user-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={["attendee"]}>
              <UserDashboard />
            </ProtectedRoute> 
            } 
          />

        {/* Organiser Dashboard */}
        <Route 
          path="/organiser-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={["organiser"]}>
              <OrganiserDashboard />
            </ProtectedRoute> 
            } 
          />

        {/* Admin Dashboard */}
        <Route 
          path="/admin-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute> 
            } 
          />
      </Routes>
    
  );
}
export default App;


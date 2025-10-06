import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EventSearch from "./components/EventSearch";
import EventDetails from "./components/EventDetails";
import FavEvents from "./components/FavEvents";
import BookedEvents from "./components/BookedEvents";
import AddNewEvent from "./components/AddNewEvent";
import MyEvents from "./components/MyEvents";
import EventStats from "./components/EventStats";
import UserSettings from "./components/UserSettings";
import "./styles/styles.css";
import "./styles/button.css";

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
          >
            <Route index element={<EventSearch />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="favourites" element={<FavEvents />} />
            <Route path="booked-events" element={<BookedEvents />} />
        </Route>

        {/* Organiser Dashboard */}
        <Route 
          path="/organiser-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={["organiser"]}>
              <OrganiserDashboard />
            </ProtectedRoute> 
            } 
          >
            {/* <Route index element={<MyEvents />} /> */}
            <Route path="organiser-dashboard" element={<OrganiserDashboard />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="events/new" element={<AddNewEvent />} />
            <Route path="my-events" element={<MyEvents />} />
          </Route>

        {/* Admin Dashboard */}
        <Route 
          path="/admin-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute> 
            } 
          >
            {/* <Route index element={<EventStats />} /> */}
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="search-events" element={<EventSearch />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="event-stats" element={<EventStats />} />
            <Route path="user-settings" element={<UserSettings />} />
        </Route>
      </Routes>
    
  );
}
export default App;


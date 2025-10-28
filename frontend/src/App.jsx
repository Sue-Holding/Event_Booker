import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import DashboardLayout from "./pages/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
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
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Dashboard Layout for all authenticated roles */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["attendee", "organiser", "admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Shared routes: all roles */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="search-events" element={<EventSearch />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="favourites" element={<FavEvents />} />
          <Route path="booked-events" element={<BookedEvents />} />

          {/* Organiser + Admin routes */}
          <Route
            path="events/new"
            element={
              <ProtectedRoute allowedRoles={["organiser", "admin"]}>
                <AddNewEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-events"
            element={
              <ProtectedRoute allowedRoles={["organiser", "admin"]}>
                <MyEvents />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="event-stats"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EventStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserSettings />
              </ProtectedRoute>
            }
          />

            {/* redirect to homepage if not authorized to view a page */}
          <Route path="*" element={<Navigate to ="/dashboard/home" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
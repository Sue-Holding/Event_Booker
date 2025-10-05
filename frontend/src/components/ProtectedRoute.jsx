import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />; // not logged in → back to landing
  }

  try {
    const decoded = jwtDecode(token);

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/" replace />; // role not allowed
    }

    return children; // user is allowed
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/" replace />;
  }
}

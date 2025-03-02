import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;  
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <h2 style={{ textAlign: "center", marginTop: "50px", color: "red" }}>Access Denied </h2>; 
  }

  return <Outlet />;  
}

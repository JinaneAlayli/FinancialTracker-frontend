import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ManageAdmins from "./pages/ManageAdmins";
import ProtectedRoute from "./components/ProtectedRoute";
import Income from "./pages/Income";
import Expense from "./pages/Expense";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
 
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/incomes" element={<Income />} />
            <Route path="/expenses" element={<Expense />} />

          </Route>
 
          <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
            <Route path="/manage-admins" element={<ManageAdmins />} />
          </Route>
 
          <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px", color: "red" }}> Page Not Found </h2>} />
        </Routes>
 
  );
}

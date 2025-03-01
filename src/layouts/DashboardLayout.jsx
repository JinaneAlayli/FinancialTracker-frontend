import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div> 
      <Header onMenuToggle={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

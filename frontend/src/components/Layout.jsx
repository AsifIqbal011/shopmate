// src/components/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        className={`
          flex-1 p-6 transition-all duration-300
          ${sidebarOpen ? "blur-sm" : ""}
          md:ml-64
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

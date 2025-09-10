// src/components/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 md:hidden"
        ></div>
      )}
      {/* Main content */}
      <div
        className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? "blur-sm" : ""}
          md:ml-64
        `}
      >
        <TopBar className="absolute p-0 m-0" />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaPlus, FaList, FaChartBar, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { MdOutlinePointOfSale } from 'react-icons/md';
import Logout from "./Logout";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0f172a] text-white p-5 flex flex-col justify-between
          z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        
          md:translate-x-0
        `}
      >
        <div>
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🛒 ShopMate</span>
          </h1>

          {/* Close button for mobile */}
          

          <nav className="flex flex-col gap-4 mt-4">
            <Link to="/dashboard" className="text-white"><NavItem icon={<FaTachometerAlt />} label="Dashboard" /></Link>
            <Link to="/add-product" className="text-white"><NavItem icon={<FaPlus />} label="Add Product" /></Link>
            <Link to="/productlist" className="text-white"><NavItem icon={<FaList />} label="Product List" /></Link>
            <Link to="/create-sale" className="text-white"><NavItem icon={<MdOutlinePointOfSale />} label="Create Sales" /></Link>
            <Link to="/reports" className="text-white"><NavItem icon={<FaChartBar />} label="Reports & Charts" /></Link>
            <Link to="/employees" className="text-white"><NavItem icon={<FaUser />} label="Employees" /></Link>
            <Link to="/settings" className="text-white"><NavItem icon={<FaCog />} label="Settings" /></Link>
          </nav>
        </div>

        <div className="mt-4">
          <button 
            onClick={Logout} 
            className="w-full flex items-center bg-[#0f172a] gap-3 p-2 rounded text-white hover:bg-red-600 text-left"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-0 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 cursor-pointer">
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;

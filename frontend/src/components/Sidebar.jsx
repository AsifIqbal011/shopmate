import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";
import { useShopRole } from "../components/ShopRoleContext"; //useContext
import {
  FaTachometerAlt,
  FaPlus,
  FaList,
  FaChartBar,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import { MdOutlinePointOfSale } from "react-icons/md";
import Logout from "./Logout";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle

  const toggleSidebar = () => setIsOpen(!isOpen);

  const { shopRole, approveEmployee, loading } = useShopRole();

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-6 left-4 z-50 text-white bg-blue-600 opacity-95 p-1.5 rounded-md"
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
          <div className={`${isOpen && "ml-10"} flex mb-7 items-center gap-2 text-xl font-bold`}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative border">
              <FaShoppingCart className= {`h-5 w-5 text-gray-900
                `
              } />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <span>ShopMate</span>
          </div>

          {/* Close button for mobile */}

          <nav className="flex flex-col gap-4 mt-4" onClick={() => isOpen && toggleSidebar()}>
            <Link to="/dashboard" className="text-white">
              <NavItem icon={<FaTachometerAlt />} label="Dashboard" />
            </Link>
            <Link to="/add-product" className="text-white">
              <NavItem icon={<FaPlus />} label="Add Product" />
            </Link>
            <Link to="/productlist" className="text-white">
              <NavItem icon={<FaList />} label="Product List" />
            </Link>
            <Link to="/create-sale" className="text-white">
              <NavItem icon={<MdOutlinePointOfSale />} label="Create Sales" />
            </Link>
            {!approveEmployee &&(
            <Link to="/reports" className="text-white">
              <NavItem icon={<FaChartBar />} label="Reports & Charts" />
            </Link> )}
            {!approveEmployee &&(
            <Link to="/employees" className="text-white">
              <NavItem icon={<FaUser />} label="Employees" />
            </Link> )}
            <Link to="/settings" className="text-white">
              <NavItem icon={<FaCog />} label="Settings" />
            </Link>
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

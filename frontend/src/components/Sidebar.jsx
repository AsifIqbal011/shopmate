import { Link } from "react-router-dom";
import { FaTachometerAlt, FaPlus, FaList, FaChartBar, FaUser, FaCog, FaSignOutAlt, FaBell, FaBoxes } from 'react-icons/fa';
import { MdOutlinePointOfSale } from 'react-icons/md';
import Logout from "./Logout";

const Sidebar = () => {
  return (
<div className="w-64 h-screen fixed top-0 left-0 bg-[#0f172a] text-white p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-white">🛒 ShopMate</span>
        </h1>
         <nav className="flex flex-col gap-4 ">
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
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 cursor-pointer">
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;

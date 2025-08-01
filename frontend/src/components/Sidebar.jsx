import { FaTachometerAlt, FaPlus, FaList, FaChartBar, FaUser, FaCog, FaSignOutAlt, FaBell, FaBoxes } from 'react-icons/fa';
import { MdOutlinePointOfSale } from 'react-icons/md';

const Sidebar = () => {
  return (
<div className="w-64 h-screen fixed top-0 left-0 bg-[#0f172a] text-white p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-white">🛒 ShopMate</span>
        </h1>
        <nav className="flex flex-col gap-4">
          <a href="dashboard"><NavItem icon={<FaTachometerAlt />} label="Dashboard" /></a>
          <NavItem icon={<FaPlus />} label="Add Product" />
          <a href="productlist"><NavItem icon={<FaList />} label="Product List" /></a>
          <NavItem icon={<MdOutlinePointOfSale />} label="Create Sales" />
          <NavItem icon={<FaChartBar />} label="Reports & charts" />
          <NavItem icon={<FaUser />} label="Employees" />
          <NavItem icon={<FaCog />} label="Settings" />
        </nav>
      </div>
      <div className="mt-4">
        <NavItem icon={<FaSignOutAlt />} label="Logout" />
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

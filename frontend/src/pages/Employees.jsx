// src/pages/Employees.jsx
import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const mockEmployees = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@shopmate.com",
    phone: "+1 (555) 123-4567",
    branch: "Main Store",
    role: "Sales Manager",
    status: "Active",
    joinDate: "2024-01-15",
    sales: 45,
    image:
      "https://images.unsplash.com/photo-1709715357519-2a84f9765e57?auto=format&fit=crop&w=80&q=60",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@shopmate.com",
    phone: "+1 (555) 234-5678",
    branch: "Branch A",
    role: "Sales Representative",
    status: "Active",
    joinDate: "2024-03-10",
    sales: 32,
    image:
      "https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=80&q=60",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@shopmate.com",
    phone: "+1 (555) 345-6789",
    branch: "Branch B",
    role: "Sales Representative",
    status: "Active",
    joinDate: "2024-05-20",
    sales: 28,
    image:
      "https://images.unsplash.com/photo-1584940121730-93ffb8aa88b0?auto=format&fit=crop&w=80&q=60",
  },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [employees, setEmployees] = useState(mockEmployees);

  const filtered = employees.filter((e) => {
    const searchMatch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());
    const branchMatch = branchFilter === "all" || e.branch === branchFilter;
    return searchMatch && branchMatch;
  });

  const addEmployee = () => alert("Add employee logic here");
  const updateEmployee = (id) => alert(`Update ${id}`);
  const removeEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    alert(`Removed ${id}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header - Centered */}
      <div className="flex flex-col items-center text-center mb-6 gap-3">
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-gray-500 max-w-xl">
          Manage your team members and track their performance.
        </p>
      </div>

      {/* Search + Branch Filter + Add Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded pl-10 pr-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* Branch filter + Add Employee button */}
        <div className="flex items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Branches</option>
            <option value="Main Store">Main Store</option>
            <option value="Branch A">Branch A</option>
            <option value="Branch B">Branch B</option>
          </select>

          <button
            onClick={addEmployee}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            <FaPlus /> Add Employee
          </button>
        </div>
      </div>

      {/* Table for desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Branch</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Sales</th>
              <th className="p-2 text-left">Join Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={e.image}
                    alt={e.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {e.name}
                </td>
                <td className="p-2">{e.email}</td>
                <td className="p-2">{e.branch}</td>
                <td className="p-2">{e.role}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      e.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="p-2 font-medium">{e.sales}</td>
                <td className="p-2">{e.joinDate}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => updateEmployee(e.id)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => removeEmployee(e.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="grid gap-4 md:hidden">
        {filtered.map((e) => (
          <div key={e.id} className="border rounded p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={e.image}
                alt={e.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{e.name}</h3>
                <p className="text-gray-500 text-sm">{e.role}</p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <FaEnvelope /> {e.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <FaPhone /> {e.phone}
            </p>
            <div className="flex justify-between mt-2 text-sm">
              <span>Branch: {e.branch}</span>
              <span>Sales: {e.sales}</span>
            </div>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => updateEmployee(e.id)}
                className="flex-1 border px-2 py-1 rounded text-blue-500 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => removeEmployee(e.id)}
                className="flex-1 border px-2 py-1 rounded text-white bg-red-600 transition-colors"
            
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

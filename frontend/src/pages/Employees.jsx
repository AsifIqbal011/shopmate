import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import axios from "axios";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [branches, setBranches] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch approved employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
        headers: { Authorization: `Token ${token}` },
      });
      setEmployees(res.data);
      console.log(employees);
      // Populate branch options dynamically
      const uniqueBranches = [
        ...new Set(res.data.map((emp) => emp.branch).filter(Boolean)),
      ];
      setBranches(uniqueBranches);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Fetch pending join requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/join-requests/", {
        headers: { Authorization: `Token ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRequests();
  }, []);

  // Approve request
  const handleApprove = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/join-requests/${id}/handle/`,
        { action: "approve" },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchEmployees();
      fetchRequests();
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/join-requests/${id}/handle/`,
        { action: "reject" },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

const removeEmployee = async (id) => {
  const confirmed = window.confirm("Are you sure you want to remove this employee?");
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      `http://localhost:8000/api/employees/${id}/`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    if (res.status === 204) {
      // Filter out the removed employee
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } else {
      console.error("Unexpected response:", res);
    }
  } catch (err) {
    console.error("Error deleting employee:", err.response?.data || err.message);
  }
};


  // Filter employees based on search and branch
  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === "all" || e.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="p-4 space-y-6 lg:w-257">
      <div className="flex flex-col items-center text-center mb-6 gap-3">
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-gray-500 max-w-xl">
          Manage your team members and approve join requests.
        </p>
      </div>

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

        {/* Branch filter */}
        <div className="flex items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pending Join Requests */}

      {/* Employee Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="p-2 text-center">Name</th>
              <th className="p-2 text-center">Email</th>
              <th className="p-2 text-center">Branch</th>
              <th className="p-2 text-center">Role</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Sales</th>
              <th className="p-2 text-center">Join Date</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="p-2 flex items-center justify-start gap-2">
                  {e?.image &&(
                  <img
                    src={`http://localhost:8000/${e.image}`}
                    alt={e.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />)}
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
                <td className="p-2">
                  {new Date(e.joinDate).toLocaleDateString("en-GB", {  day: "2-digit", month: "short",year: "numeric", })}
                </td>
                <td className="p-2 flex gap-2">
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => removeEmployee(e.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Pending Join Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <ul className="divide-y">
            {requests.map((req) => (
              <li
                key={req.id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="font-medium">{req.user_name}</p>
                  <p className="text-sm text-gray-500">{req.user_email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* mobile */}
      <div className="grid gap-4 md:hidden">
        {filtered.map((e) => (
          <div key={e.id} className="border rounded p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={`http://localhost:8000/${e.image}`} 
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
                className="flex-1 border px-2 py-1 rounded text-blue-600 hover:bg-blue-700 hover:text-white transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => removeEmployee(e.id)}
                className="flex-1 border px-2 py-1 rounded text-white bg-red-600 hover:bg-red-700  transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Employees;

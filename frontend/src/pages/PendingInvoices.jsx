import React, { useState, useMemo, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PendingInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/sales/?status=pending", {
          headers: { Authorization: `Token ${token}` },
        });

        const salesData = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        const mapped = salesData.map((sale) => ({
          id: sale.id,
          customer: sale.customer_name || "Walk-in Customer",
          amount: parseFloat(sale.total_amount),
          soldBy: sale.employee_username || "Unknown",
          branch: sale.branch_name || "Main",
          date: new Date(sale.created_at).toLocaleDateString(),
          status: sale.status || "Pending",
        }));

        setInvoices(mapped);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    let data = invoices.filter((inv) => {
      const matchesStatus = filter === "All" || inv.status === filter;
      const matchesSearch = inv.customer
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (sortBy === "date") {
      data = data.slice().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "branch") {
      data = data.slice().sort((a, b) => a.branch.localeCompare(b.branch));
    }
    return data;
  }, [invoices, filter, search, sortBy]);

  return (
    <div className="p-6 space-y-6 lg:w-256">
      <div className="flex items-center gap-3 mb-10">
        <Link to="/reports" className="p-2 text-black hover:text-blue-700 rounded">
          <FaArrowLeft />
        </Link>
        <div className="m-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Pending Statement
          </h1>
          <p className="text-gray-500 text-center">
            Manage and review all customer invoices
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">

        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1"
        />

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2"
        >
          <option value="">Sorted by</option>
          <option value="date">Date</option>
          <option value="branch">Branch</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Sold by</th>
              <th className="px-3 py-2 text-left">Branch</th>
              <th className="px-3 py-2 text-center">Date</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => setSelectedRow(inv.id)}
                className={`border-t transition hover:bg-gray-100 ${
                  selectedRow === inv.id ? "bg-gray-200" : ""
                }`}
              >
                <td className="px-3 py-2">{inv.customer}</td>
                <td className="px-3 py-2 text-right">
                  ৳{Number(inv.amount).toLocaleString()}
                </td>
                <td className="px-3 py-2">{inv.soldBy}</td>
                <td className="px-3 py-2">{inv.branch}</td>
                <td className="px-3 py-2 text-center">{inv.date}</td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 text-xs ${
                      inv.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : inv.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  {inv.status !== "completed" ? (
                    <Link
                      to={`/create-invoice/${inv.id}`}
                      className="bg-orange-600 rounded-md text-white px-3 py-1.5 hover:text-gray-800 text-sm"
                    >
                      Confirm
                    </Link>
                  ) : (
                    <span className="text-gray-400">Done</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

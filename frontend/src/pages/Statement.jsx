import React, { useState, useMemo, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Statement() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const token = localStorage.getItem("token"); // backend token

  // Fetch sales from backend
  const fetchInvoices = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/sales/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();

      console.log(data);

      // Map backend data
      const mapped = data.map((sale) => ({
        id: sale.id,
        customer:
          sale.customer?.full_name || sale.customer || "Walk-in Customer",
        amount: sale.total_amount,
        soldBy: sale.employee?.username || "Unknown",
        branch: sale.branch?.name || "N/A",
        date: new Date(sale.created_at).toLocaleDateString(),
      }));

      setInvoices(mapped);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    let data = [...invoices];

    // Search filter
    if (search.trim()) {
      data = data.filter((inv) =>
        inv.customer.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "date") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "branch") {
      data.sort((a, b) => a.branch.localeCompare(b.branch));
    }

    return data;
  }, [invoices, search, sortBy]);

  return (
    <div className="w-full min-h-screen bg-white p-6 space-y-6 lg:w-256">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link
          to="/reports"
          className="p-2 text-black hover:text-blue-700 rounded"
        >
          <FaArrowLeft />
        </Link>
        <div className="m-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Sales Statement</h1>
          <p className="text-gray-500 text-center">
            Manage and review all customer invoices
          </p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded "
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="branch">Branch</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left border">Customer</th>
              <th className="px-4 py-2 text-right border">Amount</th>
              <th className="px-4 py-2 text-left border">Sold by</th>
              <th className="px-4 py-2 text-left border">Branch</th>
              <th className="px-4 py-2 text-center border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.id}
                className="transition-all duration-300 ease-in-out hover:bg-blue-50 hover:shadow-md"
              >
                <td className="px-4 py-2 border">{inv.customer}</td>
                <td className="px-4 py-2 text-right border">
                  ৳{inv.amount.toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{inv.soldBy}</td>
                <td className="px-4 py-2 border">{inv.branch}</td>
                <td className="px-4 py-2 text-center border">{inv.date}</td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
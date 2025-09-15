import React, { useState } from "react";

export default function PendingInvoices() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      customer: "Pollo",
      location: "Hanji • Uttora",
      amount: 6000,
      date: "2025-08-20",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Mr. Rahman",
      location: "Erwin • Farmgate",
      amount: 7800,
      date: "2025-08-19",
      status: "Processing",
    },
    {
      id: 3,
      customer: "Karim",
      location: "Flok • Mirpur",
      amount: 69500,
      date: "2025-08-18",
      status: "Pending",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const markComplete = (id) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id ? { ...inv, status: "Completed" } : inv
      )
    );
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filter === "All" || inv.status === filter;
    const matchesSearch = inv.customer.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Pending Invoices</h1>
      <p className="text-gray-500 mb-4">Manage pending customer invoices</p>

      {/* Filter + Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-left">Location</th>
              <th className="border px-3 py-2 text-right">Amount</th>
              <th className="border px-3 py-2 text-center">Date</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="odd:bg-gray-50">
                <td className="border px-3 py-2">{inv.customer}</td>
                <td className="border px-3 py-2">{inv.location}</td>
                <td className="border px-3 py-2 text-right">
                  ৳{inv.amount.toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-center">{inv.date}</td>
                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      inv.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : inv.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="border px-3 py-2 text-center">
                  {inv.status !== "Completed" ? (
                    <button
                      onClick={() => markComplete(inv.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Complete
                    </button>
                  ) : (
                    <span className="text-gray-400">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

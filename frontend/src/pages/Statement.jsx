import React, { useState, useMemo } from "react";

export default function Statement() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      customer: "Pollo",
      amount: 6000,
      soldBy: "Hanji",
      branch: "Uttora",
      date: "2025-08-20",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Mr. Rahman",
      amount: 7800,
      soldBy: "Erwin",
      branch: "Farmgate",
      date: "2025-08-19",
      status: "Processing",
    },
    {
      id: 3,
      customer: "Karim",
      amount: 69500,
      soldBy: "Flok",
      branch: "Mirpur",
      date: "2025-08-18",
      status: "Pending",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(""); // "date" or "branch"
  const [selectedRow, setSelectedRow] = useState(null);

  const markComplete = (id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "Completed" } : inv
      )
    );
  };

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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-2">Sales Statement</h1>
      <p className="text-gray-500 text-center">
        Manage and review all customer invoices
      </p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2"
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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-right">Amount</th>
              <th className="border px-3 py-2 text-left">Sold by</th>
              <th className="border px-3 py-2 text-left">Branch</th>
              <th className="border px-3 py-2 text-center">Date</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => setSelectedRow(inv.id)}
                className={`border-t cursor-pointer transition hover:bg-gray-100 ${
                  selectedRow === inv.id ? "bg-gray-200" : ""
                }`}
              >
                <td className="border px-3 py-2">{inv.customer}</td>
                <td className="border px-3 py-2 text-right">
                  ৳{inv.amount.toLocaleString()}
                </td>
                <td className="border px-3 py-2">{inv.soldBy}</td>
                <td className="border px-3 py-2">{inv.branch}</td>
                <td className="border px-3 py-2 text-center">{inv.date}</td>
                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 text-xs ${
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
                      onClick={(e) => {
                        e.stopPropagation();
                        markComplete(inv.id);
                      }}
                      className="bg-green-600 text-white px-3 py-1 text-sm"
                    >
                      Complete
                    </button>
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

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Expense() {
  // Load expenses from localStorage if available
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Office Rent", amount: 5000, date: "2025-09-01", details: "Monthly office rent" },
      { id: 2, title: "Internet Bill", amount: 1200, date: "2025-09-05", details: "Broadband connection bill" },
    ];
  });

  const [formData, setFormData] = useState({ title: "", amount: "", date: "", details: "" });

  // Save expenses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) return;

    const newExpense = {
      id: expenses.length + 1,
      ...formData,
      amount: parseFloat(formData.amount),
    };

    setExpenses([...expenses, newExpense]);
    setFormData({ title: "", amount: "", date: "", details: "" });
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Prepare chart data
  const chartData = expenses.map((exp) => ({
    name: exp.title,
    amount: exp.amount,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">💰 Expense Management</h1>
      </div>

      <form onSubmit={handleAddExpense} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-600 mb-2 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> Add New Expense
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input type="text" name="title" placeholder="Expense Title" value={formData.title} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
          <input type="text" name="details" placeholder="Details" value={formData.details} onChange={handleChange} className="border rounded-lg px-3 py-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Add Expense</button>
      </form>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">📊 Expense Report</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">📝 Expense List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Details</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{exp.title}</td>
                <td className="p-3 text-green-600 font-medium">৳{exp.amount}</td>
                <td className="p-3">{exp.date}</td>
                <td className="p-3 text-gray-600">{exp.details || "—"}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">No expenses added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


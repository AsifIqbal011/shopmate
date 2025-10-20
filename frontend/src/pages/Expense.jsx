import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Pencil, Check, X } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
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
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // ✅ Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:8000/api/expenses/", {
          headers: { Authorization: `Token ${token}` },
        });
        setExpenses(res.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add an expense.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/expenses/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      setExpenses([...expenses, res.data]);
      setFormData({ title: "", amount: "", date: "", description: "" });
    } catch (error) {
      if (error.response) {
        alert(JSON.stringify(error.response.data, null, 2));
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/expenses/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (exp) => {
    setEditId(exp.id);
    setEditData({ ...exp });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        `http://localhost:8000/api/expenses/${id}/`,
        editData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      setExpenses(expenses.map((exp) => (exp.id === id ? res.data : exp)));
      setEditId(null);
      setEditData({});
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const chartData = expenses.map((exp) => ({
    name: exp.title,
    amount: exp.amount,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 lg:w-256">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/reports" className="p-2 text-black hover:text-blue-700 rounded">
          <FaArrowLeft />
        </Link>
        <div className="m-auto">
          <h1 className="text-3xl font-bold text-center mb-2">💰Expense Management</h1>
          <p className="text-gray-500 text-center">Manage all your expenses here</p>
        </div>
      </div>

      {/* Add Expense Form */}
      <form
        onSubmit={handleAddExpense}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-blue-600 mb-2 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> Add New Expense
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">📝 Expense List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-3">Title</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-gray-50">
                {editId === exp.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        name="date"
                        value={editData.date}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleSaveEdit(exp.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{exp.title}</td>
                    <td className="p-3 text-green-600 font-medium">৳{exp.amount}</td>
                    <td className="p-3">{exp.date}</td>
                    <td className="p-3 text-gray-600 truncate max-w-[150px]">{exp.description || "—"}</td>
                    <td className="p-3 flex gap-1 justify-center">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-white flex items-center gap-1"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 bg-white flex items-center gap-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No expenses added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart */}
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
    </div>
  );
}

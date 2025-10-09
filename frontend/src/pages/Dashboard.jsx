import React, { useEffect, useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaCartPlus,
  FaDollarSign,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const Dashboard = ({ isMobile }) => {
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState({
    revenue: 0,
    expense: 0,
    profit: 0,
    sales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/reports/summary/?timeframe=30days`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = res.data;
        setReportData(data.chart_data || []);
        setTotals({
          revenue: data.total_revenue || 0,
          expense: data.total_expense || 0,
          profit: data.total_profit || 0,
          sales: data.total_sales || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 lg:w-256">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                ৳{totals.revenue.toLocaleString()}
              </p>
            </div>
            <FaArrowUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Expense */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">
                ৳{totals.expense.toLocaleString()}
              </p>
            </div>
            <FaArrowDown className="h-8 w-8 text-red-500" />
          </div>
        </div>



        {/* Total Sales */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">{totals.sales}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">
                <FaCartPlus />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div
        className={`grid gap-6 ${
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {/* Revenue vs Expense Bar Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-1">Revenue vs Expenses</h2>
          <p className="text-sm text-gray-500 mb-4">
            Monthly comparison for the selected timeframe
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(v) => `৳${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v, name) => [
                    `৳${v.toLocaleString()}`,
                    name === "revenue" ? "Revenue" : "Expense",
                  ]}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend (using same data for now) */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-1">Performance Trend</h2>
          <p className="text-sm text-gray-500 mb-4">
            Monthly revenue trend
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                <Tooltip
                  formatter={(v) => [`৳${v.toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    

    </div>
  );
};

export default Dashboard;

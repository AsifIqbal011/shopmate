import React, { useEffect, useState } from "react";
import {
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaFileInvoice,
  FaPlus,
  FaFileAlt,
  FaCartPlus,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

const Reports = ({ isMobile, onPageChange }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("12months");
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState({
    revenue: 0,
    expense: 0,
    profit: 0,
    sales:0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch data from backend
useEffect(() => {
  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE}/reports/summary/?timeframe=${selectedTimeframe}`,
        {
          headers: {
            Authorization: `Token ${token}`, 
          },
        }
      );

      const data = res.data;
      setReportData(data.chart_data || []);
      setTotals({
        revenue: data.total_revenue || 0,
        expense: data.total_expense || 0,
        profit: data.total_profit || 0,
        sales: data.total_sales || 0,
      });
    } catch (err) {
      console.error("Error fetching report data:", err);
      if (err.response?.status === 401) {
        alert("Session expired or unauthorized. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchReport();
}, [selectedTimeframe]);


  const handleExportReport = () => {
    alert("Report exported successfully!");
  };

  const renderActionButtons = () => (
    <div className="flex gap-2 mb-6 flex-wrap">
      <Link
        onClick={() => onPageChange?.("pending-invoice")}
        className="px-3 py-2 text-sm rounded-full bg-yellow-500 border hover:bg-gray-50 text-white flex items-center gap-1"
        to="/pending-invoices"
      >
        <FaFileInvoice /> Invoice Pending
      </Link>
      <Link
        to="/expenses"
        className="px-3 py-2 text-sm rounded-full bg-red-600 border hover:bg-gray-50 text-white flex items-center gap-1"
      >
        <FaPlus /> Add Expenses
      </Link>
      <Link
        className="px-3 py-2 text-sm rounded-full bg-purple-600 border hover:bg-gray-50 text-white flex items-center gap-1"
        to="/statement"
      >
        <FaFileAlt /> Statement
      </Link>
    </div>
  );

  const renderMainReports = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Profit */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{totals.profit.toLocaleString()}
              </p>
            </div>
            <FaDollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Sales Count */}
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

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Revenue & Expense Analysis</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Expense</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading report...</div>
        ) : reportData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `৳${value.toLocaleString()}`,
                    name === "revenue" ? "Revenue" : "Expense",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            No data available for this timeframe.
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Reports & Charts</h1>
          <p className="text-gray-600">
            Analyze your business performance with detailed reports and charts.
          </p>
        </div>
        {renderActionButtons()}
        {renderMainReports()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 lg:w-256">
      <div className="relative mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Reports & Charts</h1>
            <p className="text-gray-600">
              Analyze your business performance with detailed reports and charts.
            </p>
          </div>
          <div className="lg:absolute right-0 top-0 flex flex-col items-end">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="border rounded px-2 py-1.5 text-xs"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
            <button
              onClick={handleExportReport}
              className="flex items-center px-2 text-xs border rounded hover:bg-gray-100"
            >
              <FaDownload className="mr-2" /> Export Report
            </button>
          </div>
        </div>

        {renderActionButtons()}
        {renderMainReports()}
      </div>
    </div>
  );
};

export default Reports;

import React from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaCartPlus
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

const revenueData = [
  { month: "Jan", revenue: 12000, expense: 8000 },
  { month: "Feb", revenue: 15000, expense: 9000 },
  { month: "Mar", revenue: 18000, expense: 10000 },
  { month: "Apr", revenue: 20000, expense: 11000 },
  { month: "May", revenue: 22000, expense: 12000 },
  { month: "Jun", revenue: 24500, expense: 8200 },
];

const salesData = [
  { day: "Mon", sales: 45 },
  { day: "Tue", sales: 52 },
  { day: "Wed", sales: 38 },
  { day: "Thu", sales: 65 },
  { day: "Fri", sales: 78 },
  { day: "Sat", sales: 82 },
  { day: "Sun", sales: 68 },
];

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpense = revenueData.reduce((sum, d) => sum + d.expense, 0);

 const Dashboard=({ isMobile })=> {
  return (
    <div className="p-4 md:p-6 space-y-6 lg:w-256">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with your business today.
        </p>
      </header>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Revenue */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ৳{totalRevenue.toLocaleString()}
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
                      ৳{totalExpense.toLocaleString()}
                    </p>
                  </div>
                  <FaArrowDown className="h-8 w-8 text-red-500" />
                </div>
              </div>
             
              {/* Sales count (example: can be from backend) */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-2xl font-bold">{revenueData.length * 5}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold"><FaCartPlus /></span>
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
        {/* Revenue vs Expenses */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-1">Revenue vs Expenses</h2>
          <p className="text-sm text-gray-500 mb-4">
            Monthly comparison for the last 6 months
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v) => [`$${v.toLocaleString()}`, ""]}
                  labelStyle={{ color: "#111827" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Sales Trend */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-1">Weekly Sales Trend</h2>
          <p className="text-sm text-gray-500 mb-4">Daily sales for this week</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                <Tooltip
                  formatter={(v) => [`${v} sales`, ""]}
                  labelStyle={{ color: "#111827" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
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
<div className="bg-white rounded-xl shadow p-4">
  <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
  <div className="space-y-4">
    {[
      {
        action: "New sale created",
        item: "iPhone 14 Pro",
        amount: "$999",
        time: "2 minutes ago",
      },
      {
        action: "Product added",
        item: "Samsung Galaxy S24",
        amount: "$849",
        time: "15 minutes ago",
      },
      {
        action: "Inventory updated",
        item: "MacBook Air M2",
        amount: "+5 units",
        time: "1 hour ago",
      },
      {
        action: "Employee added",
        item: "John Smith",
        amount: "Sales Rep",
        time: "2 hours ago",
      },
    ].map((activity, idx) => (
      <div
        key={idx}
        className="flex justify-between items-start py-2 border-b last:border-0"
      >
        {/* Left side: force left alignment */}
        <div className="flex flex-col text-left">
          <p className="font-medium text-sm">{activity.action}</p>
          <p className="text-sm text-gray-500">{activity.item}</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-sm">{activity.amount}</p>
          <p className="text-xs text-gray-400">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
export default Dashboard;
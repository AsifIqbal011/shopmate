import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.username);
  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue" value="৳12600" color="bg-blue-100" icon="৳" />
        <StatCard title="Monthly Expense" value="৳12600" color="bg-yellow-100" icon="📄" />
        <StatCard title="Monthly Profit" value="৳12600" color="bg-green-100" icon="📊" />
        <StatCard title="Unit Sale" value="125" color="bg-orange-100" icon="📦" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div className={`p-4 rounded-lg ${color} shadow-md`}>
    <div className="text-xl">{icon}</div>
    <p className="text-sm text-gray-700">{title}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

export default Dashboard;

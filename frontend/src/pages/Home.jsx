import React from 'react';
import { FaReceipt, FaChartLine } from 'react-icons/fa';
import { MdAnalytics } from 'react-icons/md';

function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl text-orange-500">🛒</span>
          <span>ShopMate</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">Doc</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
          <a href="/login" className="hover:text-gray-300">Signup/Login</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-10 bg-white">
        <h1 className="text-5xl font-bold mb-4">Welcome</h1>
        <p className="text-xl text-gray-700 mb-8">
          Let’s simplify your sales, costs, and profit tracking
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a href="/register">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium">
              Sign up
            </button>
          </a>
          <a href="/learn-more">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium">
              Learn More
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-5xl">
          <div className="flex flex-col items-center">
            <FaReceipt className="text-4xl text-black" />
            <p className="mt-3 text-blue-700 font-semibold">Generate Bills</p>
          </div>
          <div className="flex flex-col items-center">
            <FaChartLine className="text-4xl text-yellow-500" />
            <p className="mt-3 text-blue-700 font-semibold">Calculate Profit</p>
          </div>
          <div className="flex flex-col items-center">
            <MdAnalytics className="text-4xl text-blue-500" />
            <p className="mt-3 text-blue-700 font-semibold">Analysis Sales</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;

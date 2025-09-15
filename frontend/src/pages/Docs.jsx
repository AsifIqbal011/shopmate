import React from "react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <div>
    <div className="max-w-4xl mx-auto p-2 space-y-10 lg:w-257">
      {/* Header */}
      <NavBar/>
      <div className="text-center space-y-2 ">
        <h1 className="text-3xl font-bold text-gray-800 mt-23 ">📘 Documentation</h1>
        <p className="text-gray-600">Everything you need to get started with ShopMate.</p>
      </div>

      {/* Getting Started */}
      <section className="bg-white shadow-lg rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-blue-600">🚀 Getting Started</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Install dependencies → <code>npm install</code></li>
          <li>Start development server → <code>npm run dev</code></li>
          <li>Login to access the dashboard</li>
        </ul>
      </section>

      {/* Features */}
      <section className="bg-white shadow-lg rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-blue-600">✨ Features</h2>
        <ul className="space-y-2">
          {["Product management", "Sales & Invoices", "Employee management", "Reports & Analytics"].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" /> {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Learn More */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Learn More</h2>
        <p>Need extra help or have questions? Get in touch with us.</p>
        <Link
          to="/contact"
          className="inline-block bg-white text-blue-700 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100"
        >
          Go to Contact Page
        </Link>
      </section>
      
    </div>
    <Footer/>
</div>
  );
}

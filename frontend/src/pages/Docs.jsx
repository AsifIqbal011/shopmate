import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";

export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto p-2 space-y-10 lg:w-257">
      {/* Header */}
      <NavBar />
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-800 mt-23">📘 Documentation</h1>
        <p className="mt-2 text-lg text-gray-600">
          Follow the steps below to get started quickly with ShopMate and explore all key features.
        </p>
      </div>

      {/* Getting Started */}
      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">🚀 Getting Started</h2>
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Left column */}
          <ol className="list-decimal list-inside space-y-2 text-gray-700 flex-1 text-start">
            <li>Sign up and create your account</li>
            <li>Login using your credentials</li>
            <li>Create your shop profile</li>
          </ol>

          {/* Right column */}
          <ol start={4} className="list-decimal list-inside space-y-2 text-gray-700 flex-1 text-start">
            <li>Upload your first product</li>
            <li>Access the dashboard to manage everything</li>
          </ol>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">✨ Key Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
          {[
            "Interactive Dashboard with Data Visualization",
            "Add Products with Multiple Categories",
            "Category Management & Filtering",
            "Comprehensive Reports & Analytics",
            "Generate Sales & Manage Transactions",
            "Invoice Creation & Tracking",
            "Employee Management Module",
            "Branch Management Options",
          ].map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Learn More & Support */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-semibold">Need More Help?</h2>
        <p className="mt-2 text-lg">
          If you have questions or need assistance beyond this documentation, feel free to reach out.
        </p>
        <Link
          to="/contact"
          className="inline-block mt-6 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Contact Support
        </Link>
      </section>
      <Footer />
    </div>
  );
}
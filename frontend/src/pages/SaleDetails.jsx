import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const SaleDetails = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/sales/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setSale(res.data);
      } catch (err) {
        console.error("Error fetching sale details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!sale) return <div className="p-6">Sale not found.</div>;

  return (
    <div className="p-6 bg-white min-h-screen lg:w-256">
      <Link
        to="/statement"
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <FaArrowLeft /> Back to Statements
      </Link>

      <h1 className="text-2xl font-bold mb-2">Sale Details</h1>
      <p className="text-gray-500 mb-6">Invoice #{sale.invoice_number}</p>

      {/* Customer Info */}
      <div className="border p-4 rounded mb-6 bg-gray-50">
        <h2 className="font-semibold mb-2">Customer Information</h2>
        <p><strong>Name:</strong> {sale.customer_name || "Walk-in Customer"}</p>
        <p><strong>Phone:</strong> {sale.customer?.phone || "N/A"}</p>
        <p><strong>Email:</strong> {sale.customer?.email || "N/A"}</p>
      </div>

      {/* Sale Items */}
      <h2 className="font-semibold mb-3">Products Sold</h2>
      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Unit Price</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.sale_items.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.product.name}</td>
              <td className="border px-2 py-1 text-center">{item.quantity}</td>
              <td className="border px-2 py-1 text-right">৳{item.unit_price}</td>
              <td className="border px-2 py-1 text-right">
                ৳{(item.unit_price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="text-right space-y-1">
        <p><strong>Total Amount:</strong> ৳{sale.total_amount}</p>
        <p><strong>Profit:</strong> ৳{sale.profit_amount}</p>
        <p><strong>Status:</strong> {sale.status}</p>
        <p className="text-gray-500 text-sm">
          Created on: {new Date(sale.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SaleDetails;

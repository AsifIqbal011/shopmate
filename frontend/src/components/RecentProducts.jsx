import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const RecentProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE}/products/?ordering=-created_at&limit=5`, {
          headers: { Authorization: `Token ${token}` },
        });

        setRecentProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching recent products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) return <p className="text-gray-500">Loading recent products...</p>;
  if (recentProducts.length === 0) return <p className="text-gray-500">No recent products.</p>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentProducts.map((product, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start py-2 border-b last:border-0"
          >
            <div className="flex flex-col text-left">
              <p className="font-medium text-sm">Product added</p>
              <p className="text-sm text-gray-500">{product.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">৳{product.price.toLocaleString()}</p>
              <p className="text-xs text-gray-400">
                {new Date(product.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProducts;

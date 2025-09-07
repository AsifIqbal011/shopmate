import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaBox } from "react-icons/fa";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    selling_price: '',
    cost_price: '',
    quantity: '',
    shop: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post("http://localhost:8000/api/products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product added successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Error", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center border shadow-sm">
            <FaBox className="h-6 w-6 text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold mt-4">Add New Product</h2>
          <p className="text-gray-500 mt-1">Fill in the product details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              onChange={handleChange}
              placeholder="Enter product name"
              className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost Price
              </label>
              <input
                name="cost_price"
                type="number"
                onChange={handleChange}
                placeholder="৳ Cost Price"
                className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selling Price
              </label>
              <input
                name="selling_price"
                type="number"
                onChange={handleChange}
                placeholder="৳ Selling Price"
                className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Quantity & Shop Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                onChange={handleChange}
                placeholder="Stock quantity"
                className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop
              </label>
              <input
                name="shop"
                type="text"
                onChange={handleChange}
                placeholder="Shop name"
                className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="mt-1 flex items-center space-x-3">
              <label
                htmlFor="image"
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
              >
                <FaUpload className="mr-2" /> Upload
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="h-12 w-12 rounded-md object-cover border"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect } from "react";
import { FaUpload, FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token"); // get token
    axios
      .get("http://localhost:8000/api/categories/", {
        headers: {
          Authorization: `Token ${token}`, // ✅ send token
        },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a product.");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/products/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`, // ✅ Send token for authentication
          },
        }
      );

      alert("✅ Product added successfully!");
      // Reset form correctly
      setFormData({
        name: "",
        category: "",
        cost_price: "",
        selling_price: "",
        quantity: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Error", error.message);
      }
    }
  };

  const calculateProfit = () => {
    const cost = parseFloat(formData.cost_price) || 0;
    const selling = parseFloat(formData.selling_price) || 0;
    return selling - cost;
  };

  const calculateMargin = () => {
    const profit = calculateProfit();
    const selling = parseFloat(formData.selling_price) || 0;
    return selling > 0 ? ((profit / selling) * 100).toFixed(1) : "0";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Add Product</h1>
        <p className="text-gray-500">
          Add a new product to your inventory with pricing and details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      handleInputChange("category_id", e.target.value)
                    }
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-lg p-2"
                    placeholder="0.00"
                    value={formData.cost_price}
                    onChange={(e) =>
                      handleInputChange("cost_price", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-lg p-2"
                    placeholder="0.00"
                    value={formData.selling_price}
                    onChange={(e) =>
                      handleInputChange("selling_price", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Stocks *</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows={3}
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                <FaPlus /> Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Product Image</h2>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FaUpload className="text-gray-400 mx-auto mb-2 text-2xl" />
                <p className="text-sm text-gray-500 mb-4">
                  Click to upload product image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block bg-gray-100 border px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Upload Image
                </label>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Selling Price:</span>
                <span className="font-medium">
                  ৳{formData.selling_price || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cost Price:</span>
                <span className="font-medium">
                  ৳{formData.cost_price || "0.00"}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Profit:</span>
                  <span
                    className={`font-medium ${
                      calculateProfit() >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ৳{calculateProfit().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">Margin:</span>
                  <span className="text-sm text-gray-500">
                    {calculateMargin()}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

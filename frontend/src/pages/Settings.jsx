import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaExclamationTriangle,
  FaArchive,
  FaUpload
} from "react-icons/fa";

const mockBranches = [
  {
    id: "1",
    name: "Main Store",
    address: "123 Main Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    manager: "Anamina",
    status: "No",
  },
];

const API_BASE = "http://localhost:8000/api";

const Settings = () => {
  const [branches, setBranches] = useState(mockBranches);
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
    status: "Active",
  });

  const [shopData, setShopData] = useState({
    id: null,
    name: "",
    address: "",
    phone: "",
    email: "",
    shop_logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  // Fetch shop data
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/shops/me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setShopData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setShopData({
            id: null,
            name: "",
            address: "",
            phone: "",
            email: "",
            shop_logo: null,
          });
        } else {
          console.error("Error fetching shop:", err);
        }
      }
    };
    fetchShop();
  }, []);

  // Add branch
  const addBranch = (e) => {
    e.preventDefault();
    if (!newBranch.name) return;
    setBranches([...branches, { ...newBranch, id: Date.now().toString() }]);
    setNewBranch({
      name: "",
      address: "",
      phone: "",
      manager: "",
      status: "Active",
    });
  };

  // Delete branch
  const deleteBranch = (id) => {
    setBranches(branches.filter((branch) => branch.id !== id));
    if (selectedBranchId === id) setSelectedBranchId("");
  };

  // Handle shop form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setShopData({ ...shopData, [name]: files[0] });
    } else {
      setShopData({ ...shopData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopData.name) {
      alert("Shop name is required!");
      return;
    }

    const formData = new FormData();
    Object.entries(shopData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/shops/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShopData(res.data);
      alert("Shop saved successfully!");
    } catch (err) {
      console.error("Shop save error:", err.response?.data || err);
      alert("Failed to save shop");
    }
  };

  //add category
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name) {
      alert("Category name is required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/categories/`,
        {
          ...newCategory,
          shop: shopData.id, // link category to current shop
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert("Category added successfully!");
      setNewCategory({ name: "", description: "" }); // reset form
    } catch (err) {
      console.error("Category save error:", err.response?.data || err);
      alert("Failed to add category");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600 mb-6">
          Manage your business settings, branches, and preferences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Info */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="font-semibold text-xl mb-6 border-b pb-2">
              Business Information
            </h2>
            {shopData.name ? (
              <div className="grid grid-cols-1 gap-6">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="text-gray-800">{shopData.name}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="text-gray-800">{shopData.email}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="text-gray-800">{shopData.phone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-medium text-gray-600">Address:</span>
                    <span className="text-gray-800">{shopData.address}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No shop created yet.</p>
            )}
          </div>

          {/* Create Branch */}
          {shopData.owner ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaPlus /> Create New Branch
              </h3>
              <form onSubmit={addBranch} className="space-y-4">
                <input
                  type="text"
                  placeholder="Branch Name"
                  value={newBranch.name}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, name: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Branch Address"
                  value={newBranch.address}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, address: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newBranch.phone}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, phone: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Manager Name"
                  value={newBranch.manager}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, manager: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  <FaSave /> Create Branch
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaPlus /> Create New Shop
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Shop Name"
                  value={shopData?.name || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={shopData?.address || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={shopData?.phone || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={shopData?.email || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
                <label
                  htmlFor="shop_logo"
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  <FaUpload className="mr-2" />
                  Upload
                </label>
                <input
                  type="file"
                  id="shop_logo"
                  name="shop_logo"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Saving..." : "Save Shop"}
                </button>
              </form>
            </div>
          )}

          {/* Branch Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Branch Management</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Branch Name</th>
                  <th className="text-left py-2">Manager</th>
                  <th className="text-left py-2">Phone</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} className="border-b text-start">
                    <td className="py-2">
                      <p className="font-medium">{branch.name}</p>
                      <p className="text-gray-500 text-xs">{branch.address}</p>
                    </td>
                    <td>{branch.manager}</td>
                    <td>{branch.phone}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          branch.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {branch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/*add category jsx */}
          {shopData.owner && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaPlus /> Add New Category
              </h3>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={handleCategoryChange}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={handleCategoryChange}
                  className="w-full border p-2 rounded"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  <FaArchive /> Add
                </button>
              </form>
            </div>
          )}

          {/* Delete Branch */}
          <div className="bg-red-50 border border-red-200 shadow rounded-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
              <FaExclamationTriangle /> Delete Branch
            </h3>
            <p className="text-sm text-red-600 mb-4">
              Permanently delete a branch. This action cannot be undone.
            </p>
            <select
              className="w-full border p-2 rounded mb-4"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <button
              disabled={!selectedBranchId}
              onClick={() => deleteBranch(selectedBranchId)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              <FaTrash /> Delete Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

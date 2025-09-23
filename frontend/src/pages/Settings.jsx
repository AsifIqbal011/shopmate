import { useEffect, useState } from "react";
import axios from "axios";
import { useShopRole } from "../components/ShopRoleContext";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaExclamationTriangle,
  FaArchive,
  FaUpload,
} from "react-icons/fa";

const API_BASE = "http://localhost:8000/api";

const Settings = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    branch_name: "",
    location: "",
    phone: "",
  });

  const [shopData, setShopData] = useState({
    id: null,
    name: "",
    address: "",
    phone: "",
    email: "",
    shop_logo: null,
  });
  const [selectedBranchId, setSelectedBranchId] = useState("");

  // Fetch shop data
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE}/${canJoinShop ? "my-shop/" : "shops/me/"}`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
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

  // Fetch branch
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/branches/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setBranches(res.data);
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };
    fetchBranches();
  }, []);

  // Add branch
  const addBranch = async (e) => {
    e.preventDefault();
    if (!newBranch.branch_name) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/branches/`,
        {
          branch_name: newBranch.branch_name,
          location: newBranch.location,
          phone: newBranch.phone,
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      setBranches([...branches, res.data]); // use response from backend
      setNewBranch({
        branch_name: "",
        location: "",
        phone: "",
      });
    } catch (err) {
      console.error("Error adding branch:", err.response?.data || err.message);
      alert("Failed to add branch: " + JSON.stringify(err.response?.data));
    }
  };

  // Delete branch (DELETE API call)
  const deleteBranch = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/branches/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setBranches(branches.filter((branch) => branch.id !== id));
      if (selectedBranchId === id) setSelectedBranchId("");
    } catch (err) {
      console.error("Error deleting branch:", err);
    }
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

  const [shopQuery, setShopQuery] = useState("");
  const [shopResults, setShopResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // search shops by name
  const handleShopSearch = async () => {
    if (!shopQuery) return;
    setLoadingSearch(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/shop_search/`, {
        headers: { Authorization: `Token ${token}` },
        params: { q: shopQuery },
      });
      setShopResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setShopResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // send join request
  const handleJoinRequest = async (shopId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/join_shop/`,
        { shop: shopId },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Join request sent successfully!");
    } catch (err) {
      console.error("Join request error:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to send join request");
    }
  };
  //check membership
  const [canJoinShop, setCanJoinShop] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchMembershipStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://127.0.0.1:8000/api/check-membership/",
          { headers: { Authorization: `Token ${token}` } }
        );
        setCanJoinShop(res.data.can_join_shop);
      } catch (err) {
        console.error("Error fetching membership status:", err);
      }
    };

    fetchMembershipStatus();
  }, [token]);

  //check shop role
  const { shopRole, approveEmployee, loading } = useShopRole();

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

          {/* Create Branch */}
          {shopData.owner || !canJoinShop ? (
            <div>
              {shopRole?.role != "employee" && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaPlus /> Create New Branch
                  </h3>
                  <form onSubmit={addBranch} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Branch Name"
                      value={newBranch.branch_name}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          branch_name: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Branch Location"
                      value={newBranch.location}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, location: e.target.value })
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
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      <FaSave /> Create Branch
                    </button>
                  </form>
                </div>
              )}
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

          {canJoinShop && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Join a Shop</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search shop by name"
                  value={shopQuery}
                  onChange={(e) => setShopQuery(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <button
                  onClick={handleShopSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Search
                </button>
              </div>

              {loadingSearch && <p>Loading...</p>}

              <ul className="space-y-2">
                {shopResults.map((shop) => (
                  <li
                    key={shop.id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{shop.name}</p>
                      <p className="text-gray-500 text-sm">{shop.address}</p>
                    </div>
                    <button
                      onClick={() => handleJoinRequest(shop.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Request to Join
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Branch Management */}
          {shopRole?.role == "owner" && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Branch Management</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Branch Name</th>
                    <th className="text-left py-2">Phone</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id} className="border-b text-start">
                      <td className="py-2">
                        <p className="font-medium">{branch.branch_name}</p>
                        <p className="text-gray-500 text-xs">
                          {branch.location}
                        </p>
                      </td>
                      <td>{branch.phone}</td>
                      <td>
                        <span
                          className={`px-2 py-1 text-xs rounded bg-green-100 text-green-600}`}
                        >{new Date(branch.created_at).toLocaleDateString("en-GB", {  day: "2-digit", month: "short",year: "numeric", })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Delete Branch */}
          {shopRole?.role == "owner" && (
            <div className="bg-red-50 border border-red-200 shadow rounded-lg p-6 md:col-span-2">
              <h3 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
                <FaExclamationTriangle /> Delete Branch
              </h3>
              <p className="text-sm text-red-600 mb-4">
                Permanently delete a branch. This action cannot be undone.
              </p>
              <select
                className="w-full border p-2 rounded mb-4 text-black"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                <option  className=" text-black" value="">Select a branch</option>
                {branches.map((branch) => (
                  <option   key={branch.id} value={branch.id}>
                    {branch.branch_name}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useShopRole } from "../components/ShopRoleContext";
import { FaSearch, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const { shopRole, approveEmployee, loading } = useShopRole();
  // Edit state
  console.log(shopRole?.role);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category_id: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/products/", {
          headers: { Authorization: `Token ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/categories/", {
          headers: { Authorization: `Token ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Filtered products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Status helpers
  const getStatus = (units) => {
    if (units === 0) return "Out of Stock";
    if (units < 10) return "Low Stock";
    return "In Stock";
  };
  const getStatusColor = (units) => {
    if (units === 0) return "bg-red-100 text-red-800";
    if (units < 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Edit
  const handleEdit = (product) => {
    const categoryId =
      product?.category?.id !== undefined
        ? product.category.id
        : product?.category ?? "";
    setEditId(product.id);
    setEditForm({
      name: product.name ?? "",
      category_id: categoryId ?? "",
      cost_price:
        product.cost_price !== undefined ? String(product.cost_price) : "",
      selling_price:
        product.selling_price !== undefined
          ? String(product.selling_price)
          : "",
      quantity: product.quantity !== undefined ? String(product.quantity) : "",
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({
      name: "",
      category_id: "",
      cost_price: "",
      selling_price: "",
      quantity: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/products/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: editForm.name,
        cost_price: editForm.cost_price
          ? parseFloat(editForm.cost_price)
          : undefined,
        selling_price: editForm.selling_price
          ? parseFloat(editForm.selling_price)
          : undefined,
        quantity: editForm.quantity
          ? parseInt(editForm.quantity, 10)
          : undefined,
        category: editForm.category_id || null,
      };

      const res = await axios.patch(
        `http://localhost:8000/api/products/${id}/`,
        payload,
        { headers: { Authorization: `Token ${token}` } }
      );

      let updatedProduct = res.data;

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
      setEditId(null);
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:w-256">
      <h1 className="text-2xl font-bold mb-2">Product List</h1>
      <p className="text-gray-600 mb-4">
        Manage your product inventory and pricing.
      </p>

      {/* Search */}
      <div className="relative w-full sm:w-1/3 mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="w-3/4">
                      {editId === product.id ? (
                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        <h3 className="font-medium truncate">{product.name}</h3>
                      )}

                      {/* {editId === product.id ? (
                        <select
                          value={editForm.category_id ?? ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category_id: e.target.value === "" ? "" : Number(e.target.value),
                            })
                          }
                          className="border rounded px-2 py-1 text-sm w-full mt-1"
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : ( */}
                      <p className="text-sm text-gray-500">
                        {product.category?.name}
                      </p>
                      {/* )} */}
                    </div>

                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        product.quantity
                      )}`}
                    >
                      {getStatus(product.quantity)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Units: </span>
                  {editId === product.id ? (
                    <input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm({ ...editForm, quantity: e.target.value })
                      }
                      className="border rounded p-1 w-20 text-center"
                    />
                  ) : (
                    <span className="font-medium">{product.quantity}</span>
                  )}
                </div>

                <div>
                  <span className="text-gray-500">Price: </span>
                  {editId === product.id ? (
                    <input
                      type="number"
                      value={editForm.selling_price}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          selling_price: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-20 text-center"
                    />
                  ) : (
                    <span className="font-medium">
                      ৳{product.selling_price}
                    </span>
                  )}
                </div>
                {shopRole?.role == "owner" && (
                  <div>
                    <span className="text-gray-500">Cost: </span>
                    {editId === product.id ? (
                      <input
                        type="number"
                        value={editForm.cost_price}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            cost_price: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-20 text-center"
                      />
                    ) : (
                      <span className="font-medium">৳{product.cost_price}</span>
                    )}
                  </div>
                )}
                {shopRole?.role == "owner" && (
                  <div>
                    <span className="text-gray-500">Profit: </span>
                    <span
                      className={`font-medium ${
                        product.selling_price - product.cost_price > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ৳{product.selling_price - product.cost_price}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editId === product.id ? (
                  <>
                    <button
                      onClick={() => handleSave(product.id)}
                      className="flex-1 border rounded px-3 py-1 text-green-600"
                    >
                      <FaSave className="inline mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 border rounded px-3 py-1 text-gray-600"
                    >
                      <FaTimes className="inline mr-1" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 border rounded px-3 py-1 text-blue-600"
                    >
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 border rounded px-3 py-1 text-white bg-red-600"
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white shadow rounded-lg overflow-x-auto mt-4">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading products...</p>
        ) : (
          <table className="w-full table-auto text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Units</th>
                <th className="p-3 text-center">Price</th>
               {shopRole?.role == 'owner' && ( <th className="p-3 text-center">Cost</th>)}
               {shopRole?.role == 'owner' && (  <th className="p-3 text-center">Profit</th>)}
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0" />
                    )}

                    {editId === product.id ? (
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      <span className="font-medium truncate max-w-[150px]">
                        {product.name}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {/* {editId === product.id ? (
                      <select
                        value={editForm.category_id ?? ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            category_id:
                              e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    ) : ( */}
                    <span>{product.category?.name || "No category"}</span>
                    {/*  )} */}
                  </td>

                  <td className="p-3 text-center">
                    {editId === product.id ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) =>
                          setEditForm({ ...editForm, quantity: e.target.value })
                        }
                        className="border rounded p-1 w-20 text-center"
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {editId === product.id ? (
                      <input
                        type="number"
                        value={editForm.selling_price}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            selling_price: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-20 text-center"
                      />
                    ) : (
                      `৳${product.selling_price}`
                    )}
                  </td>
                  {shopRole?.role == "owner" && (
                    <td className="p-3 text-center">
                      {editId === product.id ? (
                        <input
                          type="number"
                          value={editForm.cost_price}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              cost_price: e.target.value,
                            })
                          }
                          className="border rounded p-1 w-20 text-center"
                        />
                      ) : (
                        `৳${product.cost_price}`
                      )}
                    </td>
                  )}
                  {shopRole?.role == "owner" && (
                    <td
                      className={`p-3 text-center font-medium ${
                        product.selling_price - product.cost_price > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ৳{product.selling_price - product.cost_price}
                    </td>
                  )}
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        product.quantity
                      )}`}
                    >
                      {getStatus(product.quantity)}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    {editId === product.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSave(product.id)}
                          className="p-1 text-green-600"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-1 text-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductList;

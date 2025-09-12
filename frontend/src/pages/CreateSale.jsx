// src/pages/CreateSale.jsx
import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash, FaPrint } from "react-icons/fa";

const CreateSale = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [items, setItems] = useState([
    { id: "1", name: "Click Fan", price: 3000, quantity: 1 },
    { id: "2", name: "Light Bulb", price: 600, quantity: 2 },
  ]);

  const [showReceipt, setShowReceipt] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", price: 0, quantity: 1 },
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const generateReceipt = () => {
    setShowReceipt(true);
  };

  // Receipt View
  if (showReceipt) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            {user?.profile_pic && (
              <img
                src={user.profile_pic}
                alt="Profile"
                className="w-10 h-10 rounded-full mt-4 mx-auto"
              />
            )}
            <h2 className="font-bold text-xl">MY SHOP</h2>
            <p className="text-sm text-gray-500">Receipt</p>
          </div>

          {/* Customer Info */}
          <div className="mb-4 border-b pb-3 text-sm">
            <p>
              <strong>Customer:</strong> {customer.name || "Walk-in Customer"}
            </p>
            {customer.phone && (
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
            )}
            <p>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Items */}
          <div className="mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-1 text-sm">
                <div>
                  <p className="text-start truncate max-w-[120px]" >{item.name}</p>
                  <p className="text-start text-gray-500 text-xs">
                    {item.quantity} x ৳{item.price}
                  </p>
                </div>
                <p>৳{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>৳{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowReceipt(false)}
            className="w-1/2 py-2 border rounded-lg text-gray-700 bg-white border-black"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="w-1/2 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <FaPrint /> Print
          </button>
        </div>
      </div>
    );
  }

  // Main Create Sale View
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2">Create Sale</h1>
<p className="text-gray-600 mb-2">
              Genarate Invoices and make sales
            </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Form */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border p-2 rounded"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border p-2 rounded"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email (optional)"
                className="w-full border p-2 rounded"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Sale Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Sale Items</h2>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100"
              >
                <FaPlus /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap gap-3 items-center p-3 bg-gray-50 rounded"
                >
                  {/* Product name input */}
                  <input
                    type="text"
                    placeholder="Product name"
                    className="flex-1 min-w-[100px] border p-2 rounded"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                  />

                  {/* Price input */}
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full sm:w-20 border p-2 rounded"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />

                  {/* Quantity buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateItem(
                          item.id,
                          "quantity",
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-2 bg-gray-200 rounded-full"
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItem(item.id, "quantity", item.quantity + 1)
                      }
                      className="p-2 bg-gray-200 rounded-full"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-start">{item.name || "Untitled Product"}</p>
                  <p className="text-start text-gray-500">
                    {item.quantity} x ৳{item.price}
                  </p>
                </div>
                <p>৳{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>৳{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total:</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={generateReceipt}
              className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Complete Sale
            </button>
            <button className="w-full py-2 border rounded">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;

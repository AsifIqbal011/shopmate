import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaMinus, FaTrash, FaPrint } from "react-icons/fa";
import axios from "axios";

const CreateSale = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [customer, setCustomer] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [items, setItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);

  // ✅ Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.name,
    price: p.selling_price,
  }));

const [shopId, setShopId] = useState(null);

useEffect(() => {
  const fetchShopId = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/my-shop/", {
        headers: { Authorization: `Token ${token}` },
      });
      setShopId(res.data.id);
    } catch (err) {
      console.error("Shop fetch error:", err);
    }
  };

  fetchShopId();
}, [token]);

const [shop, setShop] = useState(null);

useEffect(() => {
  const fetchShop = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/my-shop/", {
        headers: { Authorization: `Token ${token}` },
      });
      setShop(res.data);
    } catch (err) {
      console.error("Shop fetch error:", err);
    }
  };

  fetchShop();
}, [token]);

console.log(shopId);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        product_id: "",
        name: "",
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // ✅ Save sale
const handleCompleteSale = async () => {
  try {
    console.log("User object:", user);
    console.log("Shop ID sent:", shopId);

    // Step 1: Save customer
    const customerRes = await axios.post(
      "http://localhost:8000/api/customers/",
      {
        full_name: customer.full_name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      },
      { headers: { Authorization: `Token ${token}` } }
    );

    const customerId = customerRes.data.id;

    // Step 2: Save sale + items in ONE request
    const payload = {
      customer: customerId,
      total_amount: total,
      profit_amount: 0,
      invoice_number: `INV-${Date.now()}`,
      sale_items: items.map((item) => ({
         product: item.product_id,
         quantity: item.quantity,
         unit_price: item.price,
         unit_cost: item.cost_price || 0,
         total_price: item.price * item.quantity,
         total_cost: (item.cost_price || 0) * item.quantity,
      })),
    };

    console.log("Final Sale Payload:", payload);

    await axios.post("http://localhost:8000/api/sales/", payload, {
      headers: { Authorization: `Token ${token}` },
    });

    alert("Sale completed successfully!");
    setShowReceipt(true);
  } catch (err) {
    if (err.response) {
      console.error("Sale API error:", err.response.data);
      alert("Error: " + JSON.stringify(err.response.data));
    } else {
      console.error(err);
      alert("Unexpected error completing sale");
    }
  }
};

  // ✅ Receipt View
  if (showReceipt) {
     const shopName = shop?.name || "My Shop s";
     const shopImage = shop?.shop_logo? `http://localhost:8000${shop.shop_logo}`: null;
    return (
      <div className="p-6 lg:w-256">
        <div
          id="printRecipt"
          className="max-w-md mx-auto bg-white shadow rounded-lg p-6"
        >
          <div className="text-center mb-6">
          {shopImage && (
            <img
              src={shopImage}
              alt={shopName}
              className="mx-auto w-20 h-20 object-cover rounded-full mb-2"
            />
          )}
            <h2 className="font-bold text-xl">{shopName}</h2>
            <p className="text-sm text-gray-500">Receipt</p>
          </div>

          <div className="mb-4 border-b pb-3 text-sm">
            <p>
              <strong>Customer:</strong>{" "}
              {customer.full_name || "Walk-in Customer"}
            </p>
            {customer.phone && (
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
            )}
            {customer.address && (
              <p>
                <strong>Address:</strong> {customer.address}
              </p>
            )}
            <p>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-1 text-sm">
                <div>
                  <p>{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    {item.quantity} x ৳{item.price}
                  </p>
                </div>
                <p>৳{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

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

        <div className="mt-6 flex gap-3 w-sm m-auto">
          <button
            onClick={() => setShowReceipt(false)}
            className="w-1/2 py-2 border rounded-lg text-gray-700 bg-white border-black"
          >
            Back
          </button>
          <button
            onClick={() => {
              const receiptElement = document.querySelector("#printRecipt");
              if (!receiptElement) return;

              const printContents = receiptElement.innerHTML;
              const originalContents = document.body.innerHTML;

              document.body.innerHTML = `<div style="display: flex; justify-content: center; margin-top: 20px;">
                 <div style="max-width: 400px; width: 100%; padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                  ${printContents}
                 </div>
                </div>`;

              window.print();
              document.body.innerHTML = originalContents;
              window.location.reload();
            }}
            className="w-1/2 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <FaPrint /> Print
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main Create Sale Form
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2">Create Sale</h1>
      <p className="text-gray-600 mb-2">Generate invoices and make sales</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Form */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full border p-2 rounded"
                value={customer.full_name}
                onChange={(e) =>
                  setCustomer({ ...customer, full_name: e.target.value })
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
              <input
                type="text"
                placeholder="Address (optional)"
                className="w-full border p-2 rounded"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
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
                  className="flex flex-wrap gap-3 items-center p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1 min-w-[150px]">
                    <Select
                      options={productOptions}
                      value={
                        item.product_id
                          ? productOptions.find(
                              (p) => p.value === item.product_id
                            )
                          : null
                      }
                      onChange={(selected) => {
                        updateItem(item.id, {
                          product_id: selected.value,
                          name: selected.label,
                          price: parseFloat(selected.price),
                        });
                      }}
                      placeholder="Product Name"
                      isSearchable
                    />
                  </div>

                  {/* Price */}
                  <input
                    type="number"
                    className="w-full sm:w-20 border text-center p-1 rounded"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, {
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateItem(item.id, {
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                      className="p-2 bg-gray-200 rounded-full"
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItem(item.id, { quantity: item.quantity + 1 })
                      }
                      className="p-2 bg-gray-200 rounded-full"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Remove */}
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
                  <p className="truncate max-w-[120px]">
                    {item.name || "Untitled Product"}
                  </p>
                  <p className="text-gray-500 text-xs">
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
              onClick={handleCompleteSale}
              className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;

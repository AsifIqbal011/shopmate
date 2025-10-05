import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useParams, Link,useNavigate } from "react-router-dom";
import axios from "axios";



const CreateInvoice = () => {
  const navigate = useNavigate();
  const { saleId } = useParams();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // ---------------- Column Definitions ----------------
  const [columns, setColumns] = useState([
    { id: "product", name: "Product", type: "text", isCustom: false },
    { id: "unit", name: "Unit", type: "number", isCustom: false },
    { id: "sellingPrice",name: "Selling Price",type: "number",isCustom: false },
    { id: "cost", name: "Cost", type: "number", isCustom: false },
  ]);

  const [showAddField, setShowAddField] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [isPercentage, setIsPercentage] = useState(false);

  // ---------------- Fetch Sale Details ----------------
  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/api/sales/${saleId}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        const sale = res.data;

        // Map customer
        setCustomerInfo({
          name: sale.customer_name || "Walk-in Customer",
          phone: sale.customer?.phone || "",
          email: sale.customer?.email || "",
          address: sale.customer?.address || "",
        });
        console.log(sale.sale_items);
        // Map sale items
        const mappedItems = (sale.sale_items || []).map((item) => ({
          id: item.id,
          product: item.product.name,
          unit: item.quantity,
          sellingPrice: parseFloat(item.unit_price),
          cost: parseFloat(item.product.cost_price),
        }));
        setRows(mappedItems);
      } catch (err) {
        console.error("Error fetching sale details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [saleId]);
  console.log(customerInfo)
  console.log(rows)
  if (loading) return <div className="p-6">Loading...</div>;

  

  // ---------------- Helpers ----------------
  const getColumnHeader = (column) => {
    let headerText = column.name;
    if (column.operation) {
      const symbol = column.operation === "add" ? "+" : "-";
      headerText += ` (${symbol}${column.isPercentage ? "%" : ""})`;
    }
    return headerText;
  };

  const addColumn = (operation) => {
    if (newColumnName.trim()) {
      const newColumn = {
        id: newColumnName.toLowerCase().replace(/\s+/g, "_"),
        name: newColumnName,
        type: "number",
        operation,
        isPercentage,
        isCustom: true,
      };
      setColumns([...columns, newColumn]);
      setRows(rows.map((row) => ({ ...row, [newColumn.id]: "" })));
      setNewColumnName("");
      setShowAddField(false);
      setIsPercentage(false);
    }
  };

  const addProduct = () => {
    const newRow = {
      id: Date.now().toString(),
      product: "",
      unit: "",
      sellingPrice: "",
      cost: "",
    };
    columns.forEach((col) => {
      if (col.isCustom) newRow[col.id] = "";
    });
    setRows([...rows, newRow]);
  };

  const removeColumn = (columnId) => {
    setColumns(columns.filter((c) => c.id !== columnId));
    setRows(rows.map(({ [columnId]: removed, ...rest }) => rest));
  };

  const removeProduct = (productId) => {
    setRows(rows.filter((row) => row.id !== productId));
  };

  const updateCell = (rowId, columnId, value) => {
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, [columnId]: value } : row
      )
    );
  };

  // ---------------- Calculations ----------------
  const calculateModifiedSellingPrice = (row) => {
    let sellingPrice = Number(row.sellingPrice) || 0;

    columns.forEach((column) => {
      if (
        column.operation &&
        row[column.id] !== undefined &&
        row[column.id] !== ""
      ) {
        const fieldValue = Number(row[column.id]) || 0;
        if (column.isPercentage) {
          const percentageAmount = (sellingPrice * fieldValue) / 100;
          sellingPrice =
            column.operation === "add"
              ? sellingPrice + percentageAmount
              : sellingPrice - percentageAmount;
        } else {
          sellingPrice =
            column.operation === "add"
              ? sellingPrice + fieldValue
              : sellingPrice - fieldValue;
        }
      }
    });

    return sellingPrice;
  };

  const calculateProfit = (row) => {
    const modifiedSellingPrice = calculateModifiedSellingPrice(row);
    const cost = Number(row.cost) || 0;
    const unit = Number(row.unit) || 1;
    return ((modifiedSellingPrice - cost) * unit).toFixed(2);
  };

  const calculateTotals = () => {
    const subtotal = rows.reduce((sum, row) => {
      const price = calculateModifiedSellingPrice(row);
      const unit = Number(row.unit) || 1;
      return sum + price * unit;
    }, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    const totalProfit = rows.reduce(
      (sum, row) => sum + Number(calculateProfit(row)),
      0
    );
    return { subtotal, tax, total, totalProfit };
  };

  const { subtotal, tax, total, totalProfit } = calculateTotals();

  const handleCreateInvoice = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:8000/api/sales/${saleId}/confirm/`,
      {},
      { headers: { Authorization: `Token ${token}` } }
    );
    alert("Invoice confirmed and sale marked complete!");
    navigate("/pending-invoices");
  } catch (err) {
    console.error("Error confirming invoice:", err.response?.data || err);
    alert("Failed to confirm invoice: " + JSON.stringify(err.response?.data));
  }
};

  return (
    <div className="w-full min-h-screen bg-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Link
          to="/pending-invoices"
          className="p-2 text-black hover:text-blue-700 rounded"
        >
          <FaArrowLeft />
        </Link>
        <div className="m-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Create Invoice</h1>
          <p className="text-gray-500 text-center">
            Create a new customizable invoice for customers
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white border rounded shadow p-4 space-y-3 lg:col-span-1">
          <h2 className="font-semibold">Customer Information</h2>
          <input
            className="w-full border p-2 rounded"
            placeholder="Customer Name"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, name: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Phone Number"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, phone: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Email (optional)"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, email: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Address (optional)"
            value={customerInfo.address}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, address: e.target.value })
            }
          />
        </div>

        {/* Invoice Items */}
        <div className="bg-white border rounded shadow p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Invoice Items</h2>
            {/* Add custom field */}
          <div className="relative flex gap-2">
            <button
              onClick={() => setShowAddField(!showAddField)}
              className={`text-sm rounded w-37 py-2 items-center text-white ${showAddField ? " bg-red-600" : " bg-green-600"}`}
            >
              {showAddField ? "Cancel" : "Add Custom Field"}
            </button>

            {showAddField && (
              <div className="absolute mt-10 right-35 border rounded p-3 space-y-2 bg-gray-50 shadow-2xl">
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Field name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={isPercentage}
                    onChange={(e) => setIsPercentage(e.target.checked)}
                  />
                  Percentage
                </label>
                <div className="flex gap-2 justify-between">
                  <button
                    onClick={() => addColumn("add")}
                    className=" bg-green-600 text-white text-xs rounded"
                  >
                    <FaPlus/>
                  </button>
                  <button
                    onClick={() => addColumn("subtract")}
                    className=" bg-red-600 text-white text-xs rounded"
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            )}
          
            <button
              onClick={addProduct}
              className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
            >
              <FaPlus /> Add Product
            </button>
        </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-green-700 text-white">
                  {columns.map((col) => (
                    <th key={col.id} className="border px-3 py-2 text-center text-xs">
                      {getColumnHeader(col)}
                      {col.isCustom && (
                        <button
                          onClick={() => removeColumn(col.id)}
                          className="ml-2 text-red-500"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </th>
                  ))}
                  
                  <th className="border px-3 py-2 text-xs">Profit</th>
                  <th className="border px-3 py-2 text-xs">Delete</th>
                
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="odd:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.id} className="border px-2 py-1">
                        <input
                          type={col.type === "number" ? "number" : "text"}
                          value={row[col.id]}
                          onChange={(e) =>
                            updateCell(row.id, col.id, e.target.value)
                          }
                          className="w-full border p-1 rounded"
                          placeholder={col.isPercentage ? "%" : ""}
                        />
                      </td>
                    ))}
                    <td className="border px-2 py-1 text-green-600">
                      ৳{calculateProfit(row)}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => removeProduct(row.id)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div className="mt-4 space-y-2 text-right">
            <div>
              Subtotal: <span className="ml-4">৳{subtotal.toFixed(2)}</span>
            </div>
            <div>
              Tax (5%): <span className="ml-4">৳{tax.toFixed(2)}</span>
            </div>
            <div className="text-lg font-semibold border-t pt-2">
              Total: <span className="ml-4">৳{total.toFixed(2)}</span>
            </div>
            <div className="text-green-600">
              Total Profit:{" "}
              <span className="ml-4">৳{totalProfit.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateInvoice}
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              Confirm Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;

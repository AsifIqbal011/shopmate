import "./App.css";
import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

// Protected layout and pages
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import CreateSale from "./pages/CreateSale";
import CreateInvoice from "./pages/CreateInvoice";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import PendingInvoices from "./pages/PendingInvoices";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact"; 
import Logout from "./components/Logout";
import Expense from "./pages/Expense";
import Statement from "./pages/Statement";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route index element={<Home />} />
      <Route path="docs" element={<Docs />} />
      <Route path="contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes under Layout */}
      <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* Default route inside Layout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="create-sale" element={<CreateSale />} />
          <Route path="create-invoice/:saleId" element={<CreateInvoice />} />
          <Route path="reports" element={<Reports />} />
          <Route path="employees" element={<Employees />} />
          <Route path="settings" element={<Settings />} />
          <Route path="pending-invoices" element={<PendingInvoices />} />
          <Route path="statement" element={<Statement />} />
          <Route path="logout" element={<Logout />} />
          <Route path="expenses" element={<Expense />} />
          <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
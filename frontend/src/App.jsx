import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Layout from "./components/Layout";
import Login from './components/Login';

import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import CreateSale from "./pages/CreateSale";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/create-sale" element={<CreateSale />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/settings" element={<Settings />} />
             <Route path="/login" element={<Login />} />
          </Route>
      </Routes>
    </>
  );
}

export default App;

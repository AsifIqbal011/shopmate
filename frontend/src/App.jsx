import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import ProductList from "./components/ProductList";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
           <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="productlist" element={<ProductList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

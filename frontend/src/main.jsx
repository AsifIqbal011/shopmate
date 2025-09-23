import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ShopRoleProvider } from "./components/ShopRoleContext";

createRoot(document.getElementById("root")).render(
  <Router>
    <StrictMode>
      <ShopRoleProvider>
        <App />
      </ShopRoleProvider>
    </StrictMode>
  </Router>
);

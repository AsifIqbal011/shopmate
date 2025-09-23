// src/ShopRoleContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ShopRoleContext = createContext();

export const ShopRoleProvider = ({ children }) => {
  const [shopRole, setShopRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchShopRole = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/shopmembership/",
          { headers: { Authorization: `Token ${token}` } }
        );
        setShopRole(res.data[0]);
      } catch (err) {
        console.error("Error fetching Shop Role:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchShopRole();
    } else {
      setLoading(false);
    }
  }, []);

  const approveEmployee =
    shopRole?.role === "employee" && shopRole?.status === "approved";

  return (
    <ShopRoleContext.Provider value={{ shopRole, approveEmployee, loading }}>
      {children}
    </ShopRoleContext.Provider>
  );
};

export const useShopRole = () => useContext(ShopRoleContext);

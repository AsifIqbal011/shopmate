import axios from "axios";

const Logout = async () => {
  try {
    await axios.post("http://localhost:8000/auth/token/logout/");
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");  // ✅ Clear user data
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/";
  }
};

export default Logout;
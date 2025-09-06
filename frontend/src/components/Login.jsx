import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/token/login/",
        {
          username,
          password,
        }
      );

      const token = response.data.auth_token;
      localStorage.setItem("token", token); // ✅ store token
      axios.defaults.headers.common["Authorization"] = `Token ${token}`; // ✅ set for all future requests

      const userResponse = await axios.get(
        "http://localhost:8000/auth/users/me/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      // Step 3: Save user data in localStorage
      localStorage.setItem("user", JSON.stringify(userResponse.data));
      // Optional: redirect to dashboard or home
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

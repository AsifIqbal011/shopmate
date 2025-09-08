import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative">
    <div className="fixed inset-0 min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      <div className="">
        {/* Back Button */}
        <Link
          to="/"
          className="mb-6 flex items-center text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center relative border">
              <FaShoppingCart className="h-5 w-5 text-gray-900" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold mt-4">Welcome back</h2>
            <p className="text-gray-500 mt-1">
              Sign in to your ShopMate account
            </p>
          </div>

          {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4 px-0">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="mt-1 px-2 py-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="mt-1 px-2 py-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/*<button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 px-3 py-1 mt-1 right-0 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button> */}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          {/* Extra */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Trust text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Trusted by 10,000+ businesses worldwide
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;

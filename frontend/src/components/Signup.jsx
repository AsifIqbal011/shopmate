import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft, FaUpload, } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    profile_pic: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0])); // show image preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      // Create account
      await axios.post("http://localhost:8000/auth/users/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Log in
      const loginRes = await axios.post(
        "http://localhost:8000/auth/token/login/",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const token = loginRes.data.auth_token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;

      // Fetch user
      const userRes = await axios.get("http://localhost:8000/auth/users/me/");
      localStorage.setItem("user", JSON.stringify(userRes.data));

      alert("Account created & logged in!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        console.error("Signup error response:", err.response.data);
        for (const [field, messages] of Object.entries(err.response.data)) {
          alert(`${field}: ${messages.join(", ")}`);
        }
      } else {
        console.error("Signup error:", err.message);
      }
    }
  };

  return (
    <div className="relative">
      {/* Full background */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50"
        aria-hidden="true"
      />

      {/* Page content */}
      <div className="relative z-10 min-h-[100dvh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <Link
            to="/"
            className="mb-6 flex items-center text-gray-700 hover:text-gray-900"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center relative border shadow-sm">
                <FaShoppingCart className="h-5 w-5 text-gray-900" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Create Account</h2>
              <p className="text-gray-500 mt-1">Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Two-column row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter full name"
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Profile Picture */}
                <div>
                  <label
                    htmlFor="profile_pic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Picture
                  </label>

                  <div className="mt-1 flex items-center space-x-3">
                    {/* Upload Button */}

                    <label
                      htmlFor="profile_pic"
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                    >
                      <FaUpload className="mr-2" />
                      Upload
                    </label>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="profile_pic"
                      name="profile_pic"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />

                    {/* Preview */}
                    {formData.profile_pic && (
                      <img
                        src={URL.createObjectURL(formData.profile_pic)}
                        alt="Preview"
                        className="sm:h-10 sm:w-10 h-22 w-22 sm: rounded-2xl object-cover border"
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

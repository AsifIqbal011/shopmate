import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name:'',
    username: '',
    email: '',
    password: '',
    phone: '',
    profile_pic: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files  && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
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
      // Step 1: Create account
      await axios.post('http://localhost:8000/auth/users/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Step 2: Log in user automatically
      const loginRes = await axios.post('http://localhost:8000/auth/token/login/', {
        username: formData.username,
        password: formData.password
      });

      const token = loginRes.data.auth_token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      // Fetch current user
      const userRes = await axios.get('http://localhost:8000/auth/users/me/');
      localStorage.setItem('user', JSON.stringify(userRes.data));
      
      alert("Account created & logged in!");
      navigate("/dashboard");

    } catch (err) {
  if (err.response) {
    console.error("Signup error response:", err.response.data);
    for (const [field, messages] of Object.entries(err.response.data)) {
      console.error(`${field}: ${messages.join(", ")}`);
      alert(`${field}: ${messages.join(", ")}`);
    }
  } else if (err.request) {
    console.error("No response received:", err.request);
  } else {
    console.error("Error setting up request:", err.message);
  }
}
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"

          required
        />

        <input
          type="file"
          name="profile_pic"
          onChange={handleChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

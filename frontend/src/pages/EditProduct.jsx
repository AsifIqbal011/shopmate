import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    selling_price: '',
    cost_price: '',
    quantity: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => setFormData(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/products/${id}/`, formData);
    navigate('/productlist');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="border w-full p-2" placeholder="Product Name" />
        <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} className="border w-full p-2" placeholder="Selling Price" />
        <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} className="border w-full p-2" placeholder="Cost Price" />
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="border w-full p-2" placeholder="Quantity" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}

export default EditProduct;

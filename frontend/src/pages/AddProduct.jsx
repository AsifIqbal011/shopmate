import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    selling_price: '',
    cost_price: '',
    quantity: '',
    image: null,
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    axios.post('http://localhost:8000/api/products/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => alert('Product added!'))
    .catch(error => {
  if (error.response) {
    console.error('Backend error:', error.response.data);
    alert(JSON.stringify(error.response.data)); // See actual error
  } else {
    console.error('Error', error.message);
  }
})
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <input name="name" onChange={handleChange} placeholder="Product Name" className="block w-full p-2 mb-2 border" />
      <input name="cost_price" type="number" onChange={handleChange} placeholder="Cost Price" className="block w-full p-2 mb-2 border" />
      <input name="selling_price" type="number" onChange={handleChange} placeholder="Selling Price" className="block w-full p-2 mb-2 border" />
      <input name="quantity" type="number" onChange={handleChange} placeholder="Quantity" className="block w-full p-2 mb-2 border" />
      <input name="image" type="file" onChange={handleChange} className="block w-full p-2 mb-2 border" />
      <input name="shop" type="text" onChange={handleChange} placeholder="shop" className="block w-full p-2 mb-2 border" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
    </form>
  );
};

export default AddProduct;

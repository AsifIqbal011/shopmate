import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token"); // get token
    axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Token ${token}`, // ✅ send token
        },
      })
      .then(response => {
        setProducts(response.data)
        setLoading(false)
      })
      .catch(error => {
        setError('Failed to fetch products')
        setLoading(false)
      })
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

if (loading) return <div className="text-white p-4">Loading products...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>

const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/api/products/${id}/`);
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };


 return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded w-full md:w-1/3"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            <img src={product.image} alt={product.name} className="h-48 w-full object-cover mb-2" />
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p>Price: ৳{product.selling_price}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => window.location.href = `/edit-product/${product.id}`}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this product?")) {
                    axios.delete(`http://localhost:8000/api/products/${product.id}/`)
                      .then(() => setProducts(products.filter(p => p.id !== product.id)))
                      .catch(err => console.error(err));
                  }
                }}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} — ৳{p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;

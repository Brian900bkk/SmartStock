import { useEffect, useState } from "react";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AddProductModal from "../../components/AddproductModal";

function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
  
    if (!confirmDelete) return;
  
    try {
      await api.delete(`/products/${id}`);
  
      alert("Product deleted successfully!");
  
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-60">
        <Navbar />

        <div className="p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>

            <button
  onClick={() => setIsModalOpen(true)}
  className="bg-sky-600 text-white px-5 py-2 rounded-lg hover:bg-sky-700"
>
<div className="mb-5">
  <input
    type="text"
    placeholder="🔍 Search products..."
    className="w-full md:w-96 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
  />
</div>
  + Add Product
</button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Buying Price</th>
                  <th className="p-4 text-left">Selling Price</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Supplier</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">{product.id}</td>
                      <td className="p-4">{product.product_name}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">
                        KSh {product.buying_price}
                      </td>
                      <td className="p-4">
                        KSh {product.selling_price}
                      </td>
                      <td className="p-4">{product.quantity}</td>
                      <td className="p-4">{product.supplier}</td>

<td className="p-4">
  <div className="flex justify-center gap-2">
    <button
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
    >
      Edit
    </button>

    <button
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
    >
      Delete
    </button>
    <button
  onClick={() => handleDelete(product.id)}
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
>
  Delete
</button>
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-6 text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddProductModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onProductAdded={fetchProducts}
/>
    </div>
  );
}

export default Products;
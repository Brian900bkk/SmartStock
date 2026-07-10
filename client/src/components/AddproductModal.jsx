import { useState, useEffect } from "react";
import api from "../services/api";

function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
  product,
}) {
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    buying_price: "",
    selling_price: "",
    quantity: "",
    supplier: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name,
        category: product.category,
        buying_price: product.buying_price,
        selling_price: product.selling_price,
        quantity: product.quantity,
        supplier: product.supplier,
      });
    } else {
      setFormData({
        product_name: "",
        category: "",
        buying_price: "",
        selling_price: "",
        quantity: "",
        supplier: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (product) {
        await api.put(`/products/${product.id}`, formData);
        alert("Product updated successfully!");
      } else {
        await api.post("/products", formData);
        alert("Product added successfully!");
      }

      onProductAdded();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="product_name"
            placeholder="Product Name"
            value={formData.product_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="buying_price"
            placeholder="Buying Price"
            value={formData.buying_price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="selling_price"
            placeholder="Selling Price"
            value={formData.selling_price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-sky-600 text-white px-5 py-2 rounded-lg hover:bg-sky-700"
            >
              {product ? "Update Product" : "Save Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
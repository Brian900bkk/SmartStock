import { useEffect, useState } from "react";
import api from "../services/api";

function AddSaleModal({ isOpen, onClose, onSaleAdded }) {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    product_id: "",
    customer_name: "",
    quantity: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/sales", formData);

      alert("Sale recorded successfully!");

      setFormData({
        product_id: "",
        customer_name: "",
        quantity: "",
      });

      onSaleAdded();
      onClose();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to record sale."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-6">
          Record Sale
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.product_name} (Stock: {product.quantity})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
            min="1"
          />

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Save Sale
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddSaleModal;
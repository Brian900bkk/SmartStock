import { useEffect, useState } from "react";
import api from "../services/api";

function AddPurchaseModal({ isOpen, onClose, onPurchaseAdded }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    supplier_id: "",
    product_id: "",
    quantity: "",
    buying_price: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
      fetchProducts();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data.suppliers || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || res.data);
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

  const total =
    (Number(formData.quantity) || 0) *
    (Number(formData.buying_price) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/purchases", {
        ...formData,
        total_amount: total,
      });

      alert("Purchase recorded successfully!");

      setFormData({
        supplier_id: "",
        product_id: "",
        quantity: "",
        buying_price: "",
      });

      onPurchaseAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to record purchase.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          Record Purchase
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Supplier</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>

          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.product_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="buying_price"
            placeholder="Buying Price"
            value={formData.buying_price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <div className="bg-gray-100 rounded-lg p-3 font-bold text-lg">
            Total: KSh {total.toLocaleString()}
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-sky-600 text-white px-5 py-2 rounded-lg hover:bg-sky-700"
            >
              Save Purchase
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddPurchaseModal;
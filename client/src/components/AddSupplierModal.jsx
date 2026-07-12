import { useState } from "react";
import api from "../services/api";

function AddSupplierModal({ isOpen, onClose, onSupplierAdded }) {
  const [formData, setFormData] = useState({
    supplier_name: "",
    phone: "",
    email: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/suppliers", formData);

      alert("Supplier added successfully!");

      setFormData({
        supplier_name: "",
        phone: "",
        email: "",
        address: "",
      });

      onSupplierAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add supplier.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Add Supplier
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="supplier_name"
            placeholder="Supplier Name"
            value={formData.supplier_name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg"
            >
              Save Supplier
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddSupplierModal;
import { useEffect, useState } from "react";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AddSupplierModal from "../../components/AddSupplierModal";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data.suppliers);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplier_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      supplier.phone.includes(search) ||
      (supplier.email || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-60">
        <Navbar />

        <div className="p-8">

          <div className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-bold">
              Suppliers
            </h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 text-white px-5 py-3 rounded-lg hover:bg-sky-700"
            >
              + Add Supplier
            </button>

          </div>

          <input
            type="text"
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-full mb-6"
          />

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-sky-600 text-white">

                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredSuppliers.map((supplier) => (

                  <tr
                    key={supplier.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">{supplier.id}</td>

                    <td className="p-4 font-semibold">
                      {supplier.supplier_name}
                    </td>

                    <td className="p-4">{supplier.phone}</td>

                    <td className="p-4">{supplier.email}</td>

                    <td className="p-4">{supplier.address}</td>

                    <td className="p-4">

                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteSupplier(supplier.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <AddSupplierModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSupplierAdded={fetchSuppliers}
          />

        </div>
      </div>
    </div>
  );
}

export default Suppliers;
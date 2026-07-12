import { useEffect, useState } from "react";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AddCustomerModal from "../../components/AddCustomerModal";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (customer.phone || "").toLowerCase().includes(search.toLowerCase()) ||
    (customer.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-60">
        <Navbar />

        <div className="p-8">

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

            <h1 className="text-3xl font-bold">
              Customers
            </h1>

            <input
              type="text"
              placeholder="🔍 Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg p-3 w-full md:w-80"
            />

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              + Add Customer
            </button>

          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

              <thead className="bg-green-600 text-white">

                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">{customer.id}</td>
                      <td className="p-4 font-semibold">
                        {customer.full_name}
                      </td>
                      <td className="p-4">{customer.phone}</td>
                      <td className="p-4">{customer.email}</td>
                      <td className="p-4">{customer.address}</td>

                      <td className="p-4">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                          onClick={() => deleteCustomer(customer.id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-6 text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          <AddCustomerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCustomerAdded={fetchCustomers}
          />

        </div>
      </div>
    </div>
  );
}

export default Customers;
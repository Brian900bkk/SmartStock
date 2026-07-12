import { useEffect, useState } from "react";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AddPurchaseModal from "../../components/AddPurchaseModal";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/purchases");
      setPurchases(res.data.purchases);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePurchase = async (id) => {
    if (!window.confirm("Delete this purchase?")) return;

    try {
      await api.delete(`/purchases/${id}`);
      fetchPurchases();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.product_name.toLowerCase().includes(search.toLowerCase()) ||
      purchase.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-60">
        <Navbar />

        <div className="p-8">

          <div className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-bold">
              Purchases
            </h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600 text-white px-5 py-3 rounded-lg hover:bg-sky-700"
            >
              + Record Purchase
            </button>

          </div>

          <input
            type="text"
            placeholder="Search supplier or product..."
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
                  <th className="p-4">Product</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Buying Price</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredPurchases.map((purchase) => (

                  <tr
                    key={purchase.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">{purchase.id}</td>

                    <td className="p-4">
                      {purchase.supplier_name}
                    </td>

                    <td className="p-4 font-semibold">
                      {purchase.product_name}
                    </td>

                    <td className="p-4">
                      {purchase.quantity}
                    </td>

                    <td className="p-4">
                      KSh {Number(purchase.buying_price).toLocaleString()}
                    </td>

                    <td className="p-4 text-green-600 font-bold">
                      KSh {Number(purchase.total_amount).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {new Date(purchase.purchase_date).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => deletePurchase(purchase.id)}
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

          <AddPurchaseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPurchaseAdded={fetchPurchases}
          />

        </div>
      </div>
    </div>
  );
}

export default Purchases;
import { useEffect, useState } from "react";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AddSaleModal from "../../components/AddSaleModal";

function Sales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const filtered = sales.filter(
      (sale) =>
        sale.product_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        sale.customer_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredSales(filtered);
  }, [search, sales]);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
      setFilteredSales(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <div className="p-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

            <h1 className="text-3xl font-bold">
              Sales
            </h1>

            <input
              type="text"
              placeholder="🔍 Search customer or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg p-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              + Record Sale
            </button>

          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Selling Price</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>

              <tbody>

                {filteredSales.length > 0 ? (

                  filteredSales.map((sale) => (

                    <tr
                      key={sale.id}
                      className="border-b hover:bg-green-50"
                    >
                      <td className="p-4">{sale.id}</td>

                      <td className="p-4 font-semibold">
                        {sale.product_name}
                      </td>

                      <td className="p-4">
                        {sale.customer_name}
                      </td>

                      <td className="p-4">
                        {sale.quantity}
                      </td>

                      <td className="p-4">
                        KSh {Number(sale.selling_price).toLocaleString()}
                      </td>

                      <td className="p-4 text-green-700 font-bold">
                        KSh {Number(sale.total_amount).toLocaleString()}
                      </td>

                      <td className="p-4">
                        {new Date(sale.sale_date).toLocaleString()}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-6 text-gray-500"
                    >
                      No sales found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaleAdded={fetchSales}
      />

    </div>
  );
}

export default Sales;
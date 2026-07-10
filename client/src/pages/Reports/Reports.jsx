import { useEffect, useState } from "react";
import api from "../../services/api";
import * as XLSX from "xlsx";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

function Reports() {
  const [report, setReport] = useState({
    totalRevenue: 0,
    todaySales: 0,
    monthlySales: 0,
  });

  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchReport();
    fetchSales();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get("/reports");
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchSales = async () => {
    try {
      const res = await api.get("/reports/sales", {
        params: {
          filter,
          startDate,
          endDate,
        },
      });
  
      setSales(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const exportExcel = () => {
    const data = sales.map((sale) => ({
      ID: sale.id,
      Product: sale.product_name,
      Customer: sale.customer_name,
      Quantity: sale.quantity,
      "Selling Price": sale.selling_price,
      Total: sale.total_amount,
      Date: new Date(sale.sale_date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Sales Report"
    );

    XLSX.writeFile(workbook, "SmartStock_Sales_Report.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-60">
        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-8">
            Reports
          </h1>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center">

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg p-3"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>

              {filter === "custom" && (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-lg p-3"
                  />
                </>
              )}

              <button
                className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700"
              >
                Export PDF
              </button>

              <button
                onClick={exportExcel}
                className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
              >
                Export Excel
              </button>

              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                Print Report
              </button>

            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-600">
                Today's Sales
              </h2>

              <p className="text-3xl font-bold text-green-600 mt-4">
                KSh {Number(report.todaySales).toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-600">
                Monthly Sales
              </h2>

              <p className="text-3xl font-bold text-blue-600 mt-4">
                KSh {Number(report.monthlySales).toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-600">
                Total Revenue
              </h2>

              <p className="text-3xl font-bold text-purple-600 mt-4">
                KSh {Number(report.totalRevenue).toLocaleString()}
              </p>
            </div>

          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <table className="w-full">

              <thead className="bg-sky-600 text-white">

                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                </tr>

              </thead>

              <tbody>

                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">{sale.id}</td>
                      <td className="p-4">{sale.product_name}</td>
                      <td className="p-4">{sale.customer_name}</td>
                      <td className="p-4">{sale.quantity}</td>
                      <td className="p-4">
                        KSh {Number(sale.selling_price).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        KSh {Number(sale.total_amount).toLocaleString()}
                      </td>
                      <td className="p-4">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center p-6 text-gray-500"
                    >
                      No sales available.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;
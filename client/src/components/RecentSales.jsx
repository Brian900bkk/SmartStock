function RecentSales() {
    const sales = [
    
    ];
  
    return (
      <div className="bg-white rounded-2xl shadow-lg h-full p-6 border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
  
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Product</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
  
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{sale.product}</td>
                <td>{sale.customer}</td>
                <td>{sale.amount}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      sale.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default RecentSales;
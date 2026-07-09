import { FaExclamationTriangle } from "react-icons/fa";

const products = [
  { name: "HP Printer", qty: 2 },
  { name: "Dell Mouse", qty: 3 },
  { name: "A4 Printing Paper", qty: 5 },
  { name: "Keyboard", qty: 1 },
];

function LowStock() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <FaExclamationTriangle className="text-red-500 text-2xl" />
        <h2 className="text-xl font-bold text-slate-800">
          Low Stock Alerts
        </h2>
      </div>

      <div className="space-y-4">
        {products.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <small className="text-gray-500">
                Remaining stock
              </small>
            </div>

            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
              {item.qty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LowStock;
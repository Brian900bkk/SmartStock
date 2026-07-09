import { FaStar } from "react-icons/fa";

const products = [
  "HP Laptop",
  "Canon Printer",
  "Dell Mouse",
  "Keyboard",
  "Office Chair",
];

function TopProducts() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <FaStar className="text-yellow-500 text-2xl" />
        <h2 className="text-xl font-bold text-slate-800">
          Top Selling Products
        </h2>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-3"
          >
            <span>{product}</span>

            <span className="text-green-600 font-semibold">
              #{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopProducts;
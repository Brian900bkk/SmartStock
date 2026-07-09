import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";

function StatCard({ title, value, change, type }) {
  const config = {
    products: {
      icon: <FaBoxOpen />,
      color: "bg-cyan-500",
    },
    sales: {
      icon: <FaShoppingCart />,
      color: "bg-green-500",
    },
    customers: {
      icon: <FaUsers />,
      color: "bg-purple-500",
    },
    lowstock: {
      icon: <FaExclamationTriangle />,
      color: "bg-red-500",
    },
  };

  const item = config[type];

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-6">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-green-600 text-sm mt-3">
            {change}
          </p>
        </div>

        <div
          className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl`}
        >
          {item.icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;
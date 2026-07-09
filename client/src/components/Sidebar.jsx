import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartBar,
  FaRobot,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Products", icon: <FaBoxOpen />, path: "/products" },
    { name: "Categories", icon: <FaBoxOpen />, path: "/categories" },
    { name: "Customers", icon: <FaUsers />, path: "/customers" },
    { name: "Suppliers", icon: <FaTruck />, path: "/suppliers" },
    { name: "Sales", icon: <FaShoppingCart />, path: "/sales" },
    { name: "Expenses", icon: <FaMoneyBillWave />, path: "/expenses" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "AI Assistant", icon: <FaRobot />, path: "/ai" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-xl">

      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-3xl font-bold text-cyan-400">
          SmartStock
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl transition duration-200 hover:bg-cyan-500 hover:text-white"
          >
            <span className="text-lg">{item.icon}</span>

            <span className="font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;
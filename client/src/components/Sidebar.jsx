import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/products", icon: <Package size={20} /> },
    { name: "Sales", path: "/sales", icon: <ShoppingCart size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    { name: "Suppliers", path: "/suppliers", icon: <Truck size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={20} /> },
    { name: "AI Assistant", path: "/ai", icon: <Bot size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-sky-700 text-white shadow-xl">

      <div className="py-6 text-center border-b border-sky-600">
        <h1 className="text-3xl font-bold">SmartStock</h1>
        <p className="text-sm text-sky-100 mt-1">
          Inventory Management
        </p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-sky-900"
                : "hover:bg-sky-600"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-lg transition"
        >
          <LogOut size={20} />
          Logout
        </Link>
        <li>
  <Link
    to="/reports"
    className="block px-4 py-2 rounded-lg hover:bg-sky-700"
  >
    📊 Reports
  </Link>
</li>
      </div>
    </div>
  );
}

export default Sidebar;
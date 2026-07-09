import { useState, useEffect } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import RecentSales from "../components/RecentSales";
import LowStock from "../components/LowStock";
import TopProducts from "../components/TopProducts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-60 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          {/* Hero Banner */}
          <HeroBanner />

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              change="Live from database"
              type="products"
            />

            <StatCard
              title="Total Sales"
              value="KSh 125,000"
              change="+8% this month"
              type="sales"
            />

            <StatCard
              title="Customers"
              value="85"
              change="+12 New"
              type="customers"
            />

            <StatCard
              title="Total Stock"
              value={stats.totalStock}
              change="Current Inventory"
              type="lowstock"
            />
          </div>

          {/* Sales Chart + Recent Sales */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
            <div className="xl:col-span-2">
              <SalesChart />
            </div>

            <div className="xl:col-span-1">
              <RecentSales />
            </div>
          </div>

          {/* Lower Dashboard */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
            <LowStock />
            <TopProducts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import businessBg from "../assets/images/business-bg.jpg";
import { FaBoxOpen, FaChartLine, FaPlusCircle } from "react-icons/fa";

function HeroBanner() {
  return (
    <div className="relative h-60 rounded-3xl overflow-hidden shadow-xl">

      {/* Background Image */}
      <img
        src={businessBg}
        alt="Business"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex justify-between items-center px-10">

        {/* Left */}
        <div className="text-white">

          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="mt-3 text-gray-200 text-lg">
            Monitor your inventory and business performance from one dashboard.
          </p>

          <div className="mt-6 flex gap-4">

            <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold">
              <FaPlusCircle />
              Add Product
            </button>

            <button className="flex items-center gap-2 bg-white text-slate-900 hover:bg-gray-200 px-6 py-3 rounded-xl font-semibold">
              <FaChartLine />
              Reports
            </button>

          </div>

        </div>

        {/* Right */}
        <div className="hidden lg:grid grid-cols-2 gap-5">

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-white w-44">
            <FaBoxOpen size={28} />
            <h2 className="text-3xl font-bold mt-3">245</h2>
            <p>Total Products</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-white w-44">
            <FaChartLine size={28} />
            <h2 className="text-3xl font-bold mt-3">
              KSh 125K
            </h2>
            <p>This Month</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroBanner;
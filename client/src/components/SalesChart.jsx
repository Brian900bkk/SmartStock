import {
  LineChart,
  Line,
 XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 18000 },
  { month: "Mar", sales: 15000 },
  { month: "Apr", sales: 22000 },
  { month: "May", sales: 27000 },
  { month: "Jun", sales: 32000 },
];

function SalesChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Sales Overview
          </h2>

          <p className="text-gray-500 text-sm">
            Monthly sales performance
          </p>
        </div>

        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>This Year</option>
          <option>Last 6 Months</option>
          <option>Last Month</option>
        </select>

      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="month" />

          <YAxis tickFormatter={(value) => `${value / 1000}K`} />

          <Tooltip formatter={(value) => [`KSh ${value}`, "Sales"]} />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#06B6D4"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default SalesChart;
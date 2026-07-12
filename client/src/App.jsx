import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products/Products";
import Sales from "./pages/Sales/Sales";
import Reports from "./pages/Reports/Reports";
import Customers from "./pages/Customers/Customers";
import Suppliers from "./pages/Suppliers/Suppliers";
import Purchases from "./pages/Purchases/Purchases";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchases" element={<Purchases />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import "./Navbar.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <header className="navbar">
      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search products, customers..."
        />
      </div>

      <div className="navbar-right">
        <div className="notification">
          <FaBell />
          <span className="badge">3</span>
        </div>

        <div className="profile">
          <FaUserCircle className="profile-icon" />

          <div>
            <h4>Administrator</h4>
            <p>System Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
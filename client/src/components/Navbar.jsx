import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaExclamationTriangle,
  FaBoxOpen,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import api from "../services/api";

import "./Navbar.css";


function Navbar() {

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");

  const notificationRef = useRef(null);


  /*
  |--------------------------------------------------------------------------
  | Get Logged In User
  |--------------------------------------------------------------------------
  */

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("User data error:", error);
  }


  /*
  |--------------------------------------------------------------------------
  | Fetch Notifications
  |--------------------------------------------------------------------------
  */

  const fetchNotifications = async () => {

    try {

      const response = await api.get("/products");

      let products = [];

      /*
      | Handle different API response formats
      */

      if (Array.isArray(response.data)) {

        products = response.data;

      } else if (Array.isArray(response.data.products)) {

        products = response.data.products;

      } else if (Array.isArray(response.data.data)) {

        products = response.data.data;

      }


      /*
      |--------------------------------------------------------------------------
      | Create Low Stock Notifications
      |--------------------------------------------------------------------------
      */

      const lowStockNotifications = products
        .filter((product) => Number(product.quantity) <= 5)
        .map((product) => {

          const quantity = Number(product.quantity);

          return {
            id: `stock-${product.id || product.product_id || product.product_name}`,

            productName:
              product.product_name || "Unknown Product",

            quantity,

            type: quantity <= 0 ? "out" : "low",

            message:
              quantity <= 0
                ? `${product.product_name} is out of stock.`
                : `${product.product_name} has only ${quantity} unit${
                    quantity === 1 ? "" : "s"
                  } remaining.`,

          };

        });


      setNotifications(lowStockNotifications);

    } catch (error) {

      console.error(
        "Notification Error:",
        error
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Initial Load + Automatic Refresh
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchNotifications();

    const interval = setInterval(() => {

      fetchNotifications();

    }, 30000);


    return () => clearInterval(interval);

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Close Notification Dropdown When Clicking Outside
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {

        setShowNotifications(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Notification Count
  |--------------------------------------------------------------------------
  */

  const notificationCount =
    notifications.length;


  /*
  |--------------------------------------------------------------------------
  | Clear Notifications
  |--------------------------------------------------------------------------
  */

  const clearNotifications = () => {

    setNotifications([]);

  };


  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearch = (e) => {

    setSearch(e.target.value);

  };


  return (

    <header className="navbar">


      {/* SEARCH */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search products, customers..."
          value={search}
          onChange={handleSearch}
        />

      </div>



      <div className="navbar-right">


        {/* NOTIFICATIONS */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >

          <button
            className="notification"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            aria-label="Notifications"
          >

            <FaBell />

            {notificationCount > 0 && (

              <span className="badge">

                {notificationCount > 99
                  ? "99+"
                  : notificationCount}

              </span>

            )}

          </button>


          {/* NOTIFICATION DROPDOWN */}

          {showNotifications && (

            <div className="notification-dropdown">


              <div className="notification-header">

                <div>

                  <h3>Notifications</h3>

                  <p>

                    {notificationCount === 0
                      ? "You're all caught up"
                      : `${notificationCount} inventory alert${
                          notificationCount === 1
                            ? ""
                            : "s"
                        }`}

                  </p>

                </div>


                {notificationCount > 0 && (

                  <button
                    className="clear-button"
                    onClick={clearNotifications}
                  >

                    Clear all

                  </button>

                )}

              </div>



              {/* NO NOTIFICATIONS */}

              {notificationCount === 0 ? (

                <div className="empty-notifications">

                  <div className="empty-icon">

                    <FaCheck />

                  </div>

                  <h4>No new notifications</h4>

                  <p>
                    Your inventory is looking good.
                  </p>

                </div>

              ) : (


                <div className="notification-list">

                  {notifications.map(
                    (notification) => (

                      <div
                        className={`notification-item ${
                          notification.type === "out"
                            ? "out-of-stock"
                            : "low-stock"
                        }`}
                        key={notification.id}
                      >


                        <div className="notification-item-icon">

                          {notification.type === "out" ? (
                            <FaBoxOpen />
                          ) : (
                            <FaExclamationTriangle />
                          )}

                        </div>


                        <div className="notification-content">

                          <h4>

                            {notification.type === "out"
                              ? "Out of Stock"
                              : "Low Stock"}

                          </h4>

                          <p>

                            {notification.message}

                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}


            </div>

          )}

        </div>



        {/* PROFILE */}

        <div className="profile">

          <FaUserCircle className="profile-icon" />

          <div>

            <h4>

              {user?.full_name || "Administrator"}

            </h4>

            <p>

              {user?.role
                ? user.role.charAt(0).toUpperCase() +
                  user.role.slice(1)
                : "System Admin"}

            </p>

          </div>

        </div>


      </div>

    </header>

  );

}


export default Navbar;
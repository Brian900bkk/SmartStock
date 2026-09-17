import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Save login information
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-showcase">

        <div className="showcase-content">

          <div className="brand-logo">
            SS
          </div>

          <h1>
            SmartStock
          </h1>

          <p className="showcase-title">
            Smart inventory management
            <br />
            made simple.
          </p>

          <p className="showcase-description">
            Manage your products, monitor stock,
            track sales and grow your business
            from one powerful platform.
          </p>

          <div className="feature-list">

            <div className="feature">
              <span>✓</span>
              <p>Real-time inventory tracking</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Sales and revenue management</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Simple and secure business management</p>
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-section">

        <div className="login-card">

          <div className="mobile-logo">
            SS
          </div>

          <h2>
            Welcome back
          </h2>

          <p className="login-subtitle">
            Sign in to your SmartStock account
          </p>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* FORGOT PASSWORD */}
            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              <Link
                to="/forgot-password"
                className="forgot-password"
              >
                Forgot password?
              </Link>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <span>
                  Signing in...
                </span>
              ) : (
                <span>
                  Sign In
                </span>
              )}

            </button>

          </form>


          {/* DIVIDER */}
          <div className="divider">

            <span></span>

            <p>
              New to SmartStock?
            </p>

            <span></span>

          </div>


          {/* REGISTER */}
          <Link
            to="/register"
            className="create-account"
          >
            Create an account
          </Link>


          <p className="copyright">
            © {new Date().getFullYear()} SmartStock.
            All rights reserved.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
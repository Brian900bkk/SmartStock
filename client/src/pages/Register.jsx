import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "cashier",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check required fields
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      // Registration successful
      alert(res.data.message);

      navigate("/verify-email", {
        state: {
          email: formData.email,
        },
      });
    } catch (error) {
      console.error("Registration Error:", error);

      // Get the actual error message
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";

      alert(`Registration Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleRegister}>
        <div className="register-logo">SS</div>

        <h1>SmartStock</h1>

        <p className="register-subtitle">
          Create your SmartStock account
        </p>

        {/* Full Name */}
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
        </select>

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
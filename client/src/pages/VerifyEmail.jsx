import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./VerifyEmail.css";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      alert("Please enter your verification code.");
      return;
    }

    if (verificationCode.length !== 6) {
      alert("Verification code must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-email", {
        email,
        verificationCode,
      });

      alert(res.data.message);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <form
        className="verify-card"
        onSubmit={handleVerify}
      >
        <div className="verify-logo">
          SS
        </div>

        <h1>Verify Your Email</h1>

        <p>
          We sent a 6-digit verification code to:
        </p>

        <strong>
          {email || "your email address"}
        </strong>

        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(
              e.target.value.replace(/\D/g, "")
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Verifying..."
            : "Verify Email"}
        </button>

        <p className="verify-footer">
          Wrong email?{" "}
          <Link to="/register">
            Register again
          </Link>
        </p>
      </form>
    </div>
  );
}

export default VerifyEmail;
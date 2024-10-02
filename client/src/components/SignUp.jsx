// src/components/SignUp.js
import React from "react";
import "./styles/SignUp.css";

const SignUp = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Enter your details to sign up</p>
        <form className="auth-form">
          <label>Full Name</label>
          <input type="text" placeholder="Your full name" required />

          <label>Date of Birth</label>
          <input type="date" required />

          <label>Gender</label>
          <select
            style={{
              marginBottom: "1rem",
              height: "2.3rem",
              border: "1px solid black",
              borderColor: "#d4d2d2",
              borderRadius: "0.3rem",
              padding: "0.3rem",
            }}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </form>
        <button type="submit" className="auth-button">
          SIGN UP
        </button>
        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/signin" className="signin-link">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

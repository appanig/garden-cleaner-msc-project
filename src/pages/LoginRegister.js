import React, { useState } from "react";
import "./LoginRegister.css";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("homeowner");

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side image */}
        <div className="login-visual">
          <h2>GardenCleaner</h2>
          <p>Clean Spaces. Happy Faces.</p>
        </div>

        {/* Right side form */}
        <div className="login-form-section">
          {/* Tabs */}
          <div className="login-tabs">
            <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
            <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Register</button>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <label>
              <input
                type="radio"
                checked={role === "homeowner"}
                onChange={() => setRole("homeowner")}
              /> Homeowner
            </label>
            <label>
              <input
                type="radio"
                checked={role === "provider"}
                onChange={() => setRole("provider")}
              /> Provider
            </label>
          </div>

          {/* Form */}
          <form className="login-form">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            {!isLogin && <input type="password" placeholder="Confirm Password" />}
            <label className="terms">
              <input type="checkbox" /> I agree to the Terms & Conditions
            </label>
            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;

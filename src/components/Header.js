import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <Link to="/">GardenCleaner</Link>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/book">Book</Link>
          <Link to="/providers">Providers</Link>
          <Link to="/auth">
            <button className="login-button">Login</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

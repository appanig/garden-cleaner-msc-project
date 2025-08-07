import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-col">
            <h2 className="logo">GardenCleaner</h2>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/book">Book a Service</Link></li>
              <li><Link to="/providers">Find Providers</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal / Support</h4>
            <ul>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Support Center</Link></li>
              <li><Link to="#">FAQs</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: help@gardencleaner.com</p>
            <p>Phone: +44 20 1234 5678</p>
            <p>Address: Acton, London</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 GardenCleaner Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

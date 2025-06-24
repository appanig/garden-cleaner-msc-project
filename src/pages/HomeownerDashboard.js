import React from "react";
import "./HomeownerDashboard.css";
import { Link } from "react-router-dom";

function HomeownerDashboard() {
  return (
    <div className="homeowner-dashboard-page">
      <h2>Welcome, Gopichandu 👋</h2>

      {/* Quick Links */}
      <div className="quick-links">
        <Link to="/book" className="quick-link">📅 Book Again</Link>
        <Link to="#" className="quick-link">📁 View Bookings</Link>
        <Link to="#" className="quick-link">❓ Help</Link>
      </div>

      {/* Tabs Placeholder */}
      <div className="tabs">
        <button className="tab active">Bookings</button>
        <button className="tab">Profile</button>
        <button className="tab">Settings</button>
      </div>

      {/* Upcoming Bookings */}
      <div className="card">
        <h4>Upcoming Bookings</h4>
        <p><strong>Service:</strong> Gardening</p>
        <p><strong>Date:</strong> July 3, 2025</p>
        <p><strong>Provider:</strong> John EcoClean</p>
        <span className="status">Confirmed</span>
      </div>

      {/* Past Bookings */}
      <div className="card">
        <h4>Past Bookings</h4>
        <p><strong>Service:</strong> Roof Cleaning – June 10</p>
        <button className="review-btn">Leave a Review</button>
      </div>

      {/* Notifications */}
      <div className="card">
        <h4>Notifications</h4>
        <ul className="notifications-list">
          <li>Your service with John EcoClean is scheduled.</li>
          <li>Thanks for booking with us!</li>
        </ul>
      </div>
    </div>
  );
}

export default HomeownerDashboard;

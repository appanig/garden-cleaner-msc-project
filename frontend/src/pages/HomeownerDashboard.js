import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaCheckCircle,
  FaBell,
  FaEdit,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";
import "./HomeownerDashboard.css";

function HomeownerDashboard() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/bookings/homeowner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings || []);

      // Generate notifications based on booking status
      const notes = res.data.bookings.map(b => `Your booking for ${b.serviceType} on ${new Date(b.scheduledDate).toDateString()} is ${b.status}.`);
      setNotifications(notes);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const upcoming = bookings.filter(b => new Date(b.scheduledDate) > new Date());
  const past = bookings.filter(b => new Date(b.scheduledDate) <= new Date());

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaClock className="icon pending" />;
      case "accepted": return <FaCheckCircle className="icon accepted" />;
      case "completed": return <FaCheckCircle className="icon completed" />;
      case "rejected": return <FaTimesCircle className="icon rejected" />;
      default: return null;
    }
  };

  return (
    <div className="homeowner-dashboard-page">
      <h2>Welcome, {user?.name} 👋</h2>

      <div className="quick-links">
        <Link to="/book" className="quick-link">
          <FaCalendarAlt /> Book Again
        </Link>
        <Link to="/my-bookings" className="quick-link">
          <FaBook /> View Bookings
        </Link>

      </div>


      <div className="card">
        <h4><FaCalendarAlt /> Upcoming Bookings</h4>
        {upcoming.length === 0 ? <p>No upcoming bookings</p> : upcoming.map((b) => (
          <div key={b._id} className="booking-info">
            <p><strong>Service:</strong> {b.serviceType}</p>
            <p><strong>Date:</strong> {new Date(b.scheduledDate).toDateString()}</p>
            <p><strong>Provider:</strong> {b.provider?.user?.name || "N/A"}</p>
            <span className={`status ${b.status}`}>{getStatusIcon(b.status)} {b.status}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h4><FaCalendarAlt /> Past Bookings</h4>
        {past.length === 0 ? <p>No past bookings</p> : past.map((b) => (
          <div key={b._id} className="booking-info">
            <p><strong>Service:</strong> {b.serviceType}</p>
            <p><strong>Date:</strong> {new Date(b.scheduledDate).toDateString()}</p>
            {b.status === "completed" && !b.review && (
              <button className="review-btn"><FaEdit /> Leave a Review</button>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h4><FaBell /> Notifications</h4>
        <ul className="notifications-list">
          {notifications.length === 0 ? (
            <li>No notifications yet</li>
          ) : (
            notifications.map((note, i) => <li key={i}>{note}</li>)
          )}
        </ul>
      </div>

    </div>
  );
}

export default HomeownerDashboard;
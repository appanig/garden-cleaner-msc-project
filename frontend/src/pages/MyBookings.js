import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./MyBookings.css"; // Match styling with OrdersPage
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { user, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/bookings/homeowner", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data.bookings) ? res.data.bookings : [];
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    if (user) fetchBookings();
  }, [user, token]);

  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>
      <div className="bookings-table">
        <div className="bookings-header">
          <span>Service</span>
          <span>Scheduled</span>
          <span>Provider</span>
          <span>Place</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bookings-row">
              <span data-label="Service">{booking.serviceType || "N/A"}</span>
              <span data-label="Scheduled">
                {new Date(booking.scheduledDate).toLocaleDateString()}
              </span>
              <span data-label="Provider">{booking?.provider?.user?.name || "Pending"}</span>
              <span data-label="Place">{booking.place}</span>
              <span
                data-label="Status"
                className={`status-pill status-${booking.status}`}
              >
                {booking.status}
              </span>
              <span data-label="Action">
                {booking.status === "completed" ? (
                  <Link to={`/bookings/${booking._id}`} className="process-link">
                    View
                  </Link>
                ) : (
                  "-"
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;

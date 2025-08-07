import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./OrdersPage.css";
import { Link } from "react-router-dom";

function OrdersPage() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/bookings/provider", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const accepted = res.data.bookings.filter(b => b.status === "accepted" || b.status === "completed");
        setOrders(accepted);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    fetchAccepted();
  }, [token]);

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="orders-table">
        <div className="orders-header">
          <span>Buyer</span>
          <span>Service</span>
          <span>Due On</span>
          <span>Total</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {orders.length === 0 ? (
          <p className="no-orders">No accepted orders yet.</p>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="orders-row">
              <span>{o.homeowner?.name || "Unknown"}</span>
              <span>{o.serviceType}</span>
              <span>{new Date(o.scheduledDate).toLocaleDateString()}</span>
              <span>£{o.price} </span>
              <span className={`status-pill ${o.status}`}>{o.status}</span>
              <span> {o.status !== "completed" ? <Link to={`/orders/${o._id}`} className="process-link"> 'Complete Order' </Link> : 'Completed'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersPage;

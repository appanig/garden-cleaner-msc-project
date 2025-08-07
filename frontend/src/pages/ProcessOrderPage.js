import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./ProcessOrderPage.css";

function ProcessOrderPage() {
  const { orderId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [beforeImg, setBeforeImg] = useState(null);
  const [afterImg, setAfterImg] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/bookings/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Failed to load booking", err);
      }
    };
    fetchBooking();
  }, [orderId, token]);

  const handleUploadAndComplete = async () => {
    const formData = new FormData();
    formData.append("beforeImage", beforeImg);
    formData.append("afterImage", afterImg);

    try {
      await axios.put(`http://localhost:5050/api/bookings/complete/${orderId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Order marked as completed!");
      navigate("/dashboard/orders");
    } catch (err) {
      console.error("Error completing order", err);
    }
  };

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="process-order-page">
      <h2>📝 Process Order</h2>
      <div className="booking-info">
        <p><strong>Buyer:</strong> {booking.homeowner?.name || "Unknown"}</p>
        <p><strong>Service:</strong> {booking.serviceType}</p>
        <p><strong>Place:</strong> {booking.place}</p>
        <p><strong>Due On:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ${booking.price}</p>
        <p><strong>Status:</strong> {booking.status}</p>
      </div>

      <div className="upload-section">
        <label>Before Photo:</label>
        <input type="file" onChange={(e) => setBeforeImg(e.target.files[0])} />
        <label>After Photo:</label>
        <input type="file" onChange={(e) => setAfterImg(e.target.files[0])} />
      </div>

      <button className="complete-button" onClick={handleUploadAndComplete} disabled={!beforeImg || !afterImg}>
        ✅ Complete Order
      </button>
    </div>
  );
}

export default ProcessOrderPage;

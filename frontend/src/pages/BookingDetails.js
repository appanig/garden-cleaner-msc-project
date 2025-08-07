import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./BookingDetails.css";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const { token } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data.booking);
        
      } catch (err) {
        console.error("Failed to fetch booking", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, token]);

  const handleReviewSubmit = async () => {
    try {
     const res = await axios.post(
        `http://localhost:5050/api/bookings/${bookingId}/review`,
        { rating, review: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.status === 200){
        alert("Review posted successfully!");
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  if (loading) return <div className="booking-details">Loading...</div>;
  if (!booking) return <div className="booking-details">Booking not found.</div>;

  return (
    <div className="booking-details">
      <h2>Booking Details</h2>
      <div className="details-grid">
        <p><strong>Service:</strong> {booking.serviceType}</p>
        <p><strong>Provider:</strong> {booking?.provider?.user?.name || "N/A"}</p>
        <p><strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleString()}</p>
        <p><strong>Location:</strong> {booking.place}</p>
        <p><strong>Status:</strong> <span className={`status-pill ${booking.status}`}>{booking.status}</span></p>
        <p><strong>Price:</strong> £ {booking.price}</p>
      </div>

      {booking.status === "completed" && (
        <div className="completed-section">
          <h3>Service Images</h3>
          <div className="images-grid">
            <div>
              <p>Before</p>
              <img src={"http://localhost:5050/" + booking.beforeImage} alt="Before Service" />
            </div>
            <div>
              <p>After</p>
              <img src={"http://localhost:5050/" + booking.afterImage} alt="After Service" />
            </div>
          </div>

          {!booking.review && !submitted && (
            <div className="review-section">
              <h3>Leave a Review</h3>
              <textarea
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your feedback..."
              />
              <label>
                Rating:
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </label>
              <button onClick={handleReviewSubmit}>Submit Review</button>
            </div>
          )}

          {(booking.review || submitted) && (
            <div className="submitted-review">
              <h3>Your Review</h3>
              <p><strong>Rating:</strong> {rating} ⭐</p>
              <p>{reviewText || booking.review}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingDetails;

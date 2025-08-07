import React, { useState } from "react";
import "./SubmitReview.css";

function SubmitReview() {
  const [stars, setStars] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="submit-review-page">
      <h2>Leave a Review</h2>

      {/* Star Rating */}
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={stars >= n ? "star active" : "star"}
            onClick={() => setStars(n)}
          >
            ⭐
          </span>
        ))}
        <span className="emoji">{["😡", "😕", "😐", "😊", "😍"][stars - 1]}</span>
      </div>

      {/* Text Review */}
      <textarea rows={5} placeholder="Write your feedback..." />

      {/* Image Upload */}
      <div className="image-upload">
        <label>Upload a Photo (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="preview-image" />
        )}
      </div>

      {/* Submit */}
      <button className="submit-btn">Submit Review</button>
    </div>
  );
}

export default SubmitReview;

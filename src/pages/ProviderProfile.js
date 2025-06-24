import React from "react";
import "./ProviderProfile.css";
import { Link } from "react-router-dom";

function ProviderProfile() {
  return (
    <div className="provider-profile-page">
      {/* Header */}
      <div className="profile-header">
        <img src="https://i.pravatar.cc/100?img=12" alt="provider" />
        <div>
          <h2>John EcoClean</h2>
          <p className="badge">✅ Eco Certified</p>
          <p>London, UK – 8+ years of experience</p>
        </div>
      </div>

      {/* Services Offered */}
      <section className="services-section">
        <h3>Services Offered</h3>
        <ul>
          <li>🌿 Garden Maintenance</li>
          <li>🧼 Roof Cleaning</li>
          <li>🪟 Window Washing</li>
        </ul>
      </section>

      {/* Gallery */}
      <section className="gallery-section">
        <h3>Before & After Gallery</h3>
        <div className="gallery">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={`https://source.unsplash.com/300x200/?garden,cleaning,${i}`}
              alt="Before and After"
            />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">
        <h3>Customer Reviews</h3>
        <div className="review-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p>“John was super professional and left our backyard spotless!”</p>
          <div className="reviewer">– Ayesha, London</div>
        </div>
        <div className="review-card">
          <div className="stars">⭐⭐⭐⭐</div>
          <p>“Very efficient, and I appreciate the eco-friendly products!”</p>
          <div className="reviewer">– Ravi, Acton</div>
        </div>
      </section>

      {/* Floating Book Button */}
      <div className="book-now-bar">
        <Link to="/book">
          <button>Book This Provider</button>
        </Link>
      </div>
    </div>
  );
}

export default ProviderProfile;

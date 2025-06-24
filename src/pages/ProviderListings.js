import React from "react";
import "./ProviderListings.css";
import { Link } from "react-router-dom";

function ProviderListings() {
  return (
    <div className="provider-listings-page">
      <h2>Find a Cleaning Professional</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input type="text" placeholder="Location" />
        <select>
          <option>All Services</option>
          <option>Gardening</option>
          <option>Roof Cleaning</option>
        </select>
        <label>
          <input type="checkbox" />
          Eco-Certified Only
        </label>
        <label>
          Rating
        <input type="range" min="1" max="5" />
        </label>
      </div>

      {/* Providers Grid */}
      <div className="provider-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="provider-card" key={i}>
            <img src={`https://i.pravatar.cc/100?img=${i}`} alt="provider" />
            <h3>Provider Name {i}</h3>
            <div className="badges">✅ Eco Certified</div>
            <p>Experienced outdoor cleaner based in London. Specializes in eco-safe products.</p>
            <div className="rating">⭐⭐⭐⭐☆</div>
            <Link to={`/provider/${i}`}><button>View Profile</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProviderListings;

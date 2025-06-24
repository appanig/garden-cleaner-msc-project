import React from "react";
import "./BookService.css";

function BookService() {
  return (
    <div className="book-service-page">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: "33%" }}></div>
      </div>

      <h2>Book a Service</h2>
      <form className="booking-form">

        {/* Service Selection */}
        <div className="form-card">
          <label>Select a Service</label>
          <select>
            <option>Gardening</option>
            <option>Roof Cleaning</option>
            <option>Window Washing</option>
          </select>
        </div>

        {/* Provider Selection */}
        <div className="form-card">
          <label>Choose Provider or Auto-Match</label>
          <select>
            <option>Auto-Match Me</option>
            <option>John's Garden Services</option>
            <option>Eco Clean Roofs</option>
          </select>
        </div>

        {/* Date & Time */}
        <div className="form-card">
          <label>Select Date</label>
          <input type="date" />
        </div>

        {/* Add-ons */}
        <div className="form-card">
          <label>Add-ons / Packages</label>
          <input type="text" placeholder="e.g., Lawn edging, compost removal" />
        </div>

        {/* Address */}
        <div className="form-card">
          <label>Address & Instructions</label>
          <textarea rows={4} placeholder="Enter full address and notes for the cleaner" />
        </div>

        {/* Summary */}
        <div className="form-card summary">
          <h4>Review Summary</h4>
          <p>Service: Gardening</p>
          <p>Date: 2025-07-01</p>
          <p>Provider: Auto-Matched</p>
        </div>

        {/* Sticky Button */}
        <div className="sticky-continue">
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  );
}

export default BookService;

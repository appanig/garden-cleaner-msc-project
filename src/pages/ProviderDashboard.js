import React from "react";
import "./ProviderDashboard.css";

function ProviderDashboard() {
  return (
    <div className="provider-dashboard-page">
      <h2>Welcome, Provider 👷</h2>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab active">Jobs</button>
        <button className="tab">Earnings</button>
        <button className="tab">Profile</button>
      </div>

      {/* Job Queue */}
      <div className="card">
        <h4>New Job Requests</h4>
        <div className="job-item">
          <p>🧹 Service: Garden Cleanup – July 5</p>
          <p>📍 Address: 123 Green Lane</p>
          <span className="status-pill pending">Pending</span>
          <div className="actions">
            <button className="accept">Accept</button>
            <button className="reject">Reject</button>
          </div>
        </div>
      </div>

      {/* Today's Jobs */}
      <div className="card">
        <h4>Today's Jobs</h4>
        <div className="job-item">
          <p>🌿 Service: Lawn Mowing – 3 PM</p>
          <p>📍 Acton, London</p>
          <span className="status-pill in-progress">In Progress</span>
          <div className="upload-box">
            <input type="file" />
          </div>
          <button className="complete-btn">Mark Complete</button>
        </div>
      </div>

      {/* Earnings */}
      <div className="card">
        <h4>Earnings</h4>
        <p>This Week: <strong>£120</strong></p>
        <p>Lifetime: <strong>£2,300</strong></p>
      </div>

      {/* Reviews */}
      <div className="card">
        <h4>Recent Reviews</h4>
        <p>⭐⭐⭐⭐⭐ “Very clean work, on time and polite!” – Sarah</p>
        <p>⭐⭐⭐⭐ “Neatly done garden, would book again.” – Mark</p>
      </div>
    </div>
  );
}

export default ProviderDashboard;

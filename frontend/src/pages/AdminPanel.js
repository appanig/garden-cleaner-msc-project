import React from "react";
import "./AdminPanel.css";

function AdminPanel() {
  return (
    <div className="admin-panel-page">
      <h2>Admin Dashboard</h2>

      {/* Tabs (non-functional placeholder) */}
      <div className="tabs">
        <button className="tab active">Users</button>
        <button className="tab">Bookings</button>
        <button className="tab">Providers</button>
        <button className="tab">Reviews</button>
        <button className="tab">Metrics</button>
      </div>

      {/* User Management */}
      <div className="card">
        <h4>User Management</h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ayesha Khan</td>
              <td>ayesha@email.com</td>
              <td><span className="status green">Active</span></td>
              <td>
                <button>Suspend</button>
                <button>Reset</button>
              </td>
            </tr>
            <tr>
              <td>Mark Singh</td>
              <td>mark@email.com</td>
              <td><span className="status yellow">Pending</span></td>
              <td>
                <button>Suspend</button>
                <button>Reset</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Provider Approvals */}
      <div className="card">
        <h4>Pending Provider Approvals</h4>
        <ul>
          <li>EcoClean Services – Document uploaded <button>Approve</button></li>
          <li>GreenForce Ltd – Awaiting docs <button disabled>Approve</button></li>
        </ul>
      </div>

      {/* Bookings Overview */}
      <div className="card">
        <h4>Bookings Overview</h4>
        <p>Total Bookings: 64</p>
        <p>Active Jobs: 3</p>
        <p>Cancelled: 4</p>
      </div>

      {/* Review Moderation */}
      <div className="card">
        <h4>Flagged Reviews</h4>
        <p>"Service was terrible" – by UserX <button>Remove</button> <button>Ignore</button></p>
      </div>

      {/* Metrics */}
      <div className="card">
        <h4>Platform Metrics</h4>
        <p>Users: 120</p>
        <p>Providers: 42</p>
        <p>New Signups This Week: 9</p>
      </div>
    </div>
  );
}

export default AdminPanel;

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiUserCheck } from 'react-icons/fi';
import { MdEmail, MdOutlineEco, MdList } from 'react-icons/md';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { token, dispatch} = useContext(AuthContext);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/admin/all-providers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingProviders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPending();
  }, [token]);

  const handleReject = async (id) => {
    if (window.confirm("Do you really want to delete it?")) {
      try {
        await axios.delete(`http://localhost:5050/api/admin/reject/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingProviders((prev) => prev.filter((p) => p._id !== id));
        if (selectedProvider?._id === id) setSelectedProvider(null);
      } catch (err) {
        console.error("Error deleting provider:", err);
        alert("Something went wrong while deleting the provider.");
      }
    }

  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2><FiUsers /> Partners</h2>
        <ul>
          {pendingProviders.map((provider) => (
            <li
              key={provider._id}
              className={selectedProvider?._id === provider._id ? 'active' : ''}
              onClick={() => setSelectedProvider(provider)}
            >
              <strong>{provider.user.name}</strong>
              <span>{provider.user.email}</span>
            </li>
          ))}
        </ul>
        <button onClick={() => {
          dispatch({ type: "LOGOUT" });
          localStorage.clear();
        }}>Logout</button>
      </aside>

      {/* Short View */}
      <section className="admin-short-view">
        <h2><MdList /> All Pending</h2>
        {pendingProviders.length === 0 ? (
          <p>✅ No pending provider requests.</p>
        ) : (
          pendingProviders.map((provider) => (
            <div
              className={`short-card ${selectedProvider?._id === provider._id ? 'highlight' : ''}`}
              key={provider._id}
              onClick={() => setSelectedProvider(provider)}
            >
              <h4>{provider.user.name}</h4>
              <p><MdEmail /> {provider.user.email}</p>

            </div>
          ))
        )}
      </section>

      {/* Detailed View */}
      <section className="admin-details">
        <h2><FiUserCheck /> Detailed Profile</h2>
        {selectedProvider ? (
          <div>
            <p><strong>Name:</strong> {selectedProvider.user.name}</p>
            <p><MdEmail /> <strong>Email:</strong> {selectedProvider.user.email}</p>
            <p>
              <MdOutlineEco /> <strong>Eco-Friendly:</strong>{' '}
              {selectedProvider.isEcoFriendly ? 'Yes 🌱' : 'No 🌍'}
            </p>

            <div className="services-list">
              <strong>Services:</strong>
              {selectedProvider.services.length > 0 ? (
                <div className="service-tags">
                  {selectedProvider.services.map((s) => (
                    <span className="service-badge" key={s._id}>
                      {s.name} - £{s.price}
                    </span>
                  ))}
                </div>
              ) : (
                <p>None</p>
              )}
            </div>

            <button className="reject-btn" onClick={() => handleReject(selectedProvider._id)}>
              Reject
            </button>
          </div>
        ) : (
          <p>Select a provider to view details.</p>
        )}
      </section>
    </div>
  );
}

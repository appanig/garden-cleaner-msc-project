import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./ProviderDashboard.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function ProviderDashboard() {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("jobs");
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [activeProvider, setActiveProvider] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    description: "",
    ecoFriendly: false,
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (activeTab === "services") fetchServices();
    if (activeTab === "jobs") fetchBookings();
    if(activeTab === "earnings") fetchProvider();
    if (location.state?.openJobs) {
      setActiveTab("jobs");

      navigate(location.pathname, { replace: true });
    }
  }, [activeTab, location.state]);

  const fetchProvider = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5050/api/provider/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveProvider(data);
    }
    catch (err) {
        console.error("Error fetching provider", err);
      }
  }

  const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/bookings/provider`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };

    const handleAccept = async (bookingId) => {
      try {
        await axios.put(`http://localhost:5050/api/bookings/${bookingId}/status`, {
          status: "accepted",
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/dashboard/orders"); // redirect to orders page
      } catch (err) {
        console.error("Failed to accept booking", err);
      }
    };

    const handleReject = async (bookingId) => {
      try {
        await axios.put(`http://localhost:5050/api/bookings/${bookingId}/status`, {
          status: "rejected",
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchBookings();
      } catch (err) {
        console.error("Failed to reject booking", err);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/services/my-services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data.services);
      } catch (err) {
        console.error("Error loading services", err);
      }
    };

    const handleServiceSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          "http://localhost:5050/api/services",
          newService,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices([...services, res.data.service]);
        setNewService({ name: "", price: "", description: "", ecoFriendly: false });
      } catch (err) {
        console.error(err);
      }
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this service?")) return;
      try {
        await axios.delete(`http://localhost:5050/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(services.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Failed to delete service", err);
      }
    };

    const handleEdit = (service) => {
      setEditingServiceId(service._id);
      setEditedService({ ...service });
    };

    const handleUpdate = async (id) => {
      try {
        const res = await axios.put(
          `http://localhost:5050/api/services/${id}`,
          editedService,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = services.map((s) => (s._id === id ? res.data.service : s));
        setServices(updated);
        setEditingServiceId(null);
      } catch (err) {
        console.error("Failed to update", err);
      }
    };

    return (
      <div className="provider-dashboard-page">
        <h2>Welcome, {user?.name || "Provider"} 👷</h2>

        <div className="tabs">
          {["jobs", "services", "earnings"].map((tab) => (
            <button
              key={tab}
              className={`button_tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "jobs" && (
          <div className="card">
            <h4>New Job Requests</h4>
            {bookings.filter(b => b.status === 'pending').map((b) => (
              <div key={b._id} className="job-item">
                <p>🧹 {b.serviceType} – {new Date(b.scheduledDate).toDateString()}</p>
                <p>📍  {b.place}</p>
                <p>{b.notes}</p>
                <span className="status-pill pending">{b.status}</span>
                <div className="actions">
                  <button className="accept" onClick={() => handleAccept(b._id)}>Accept</button>
                  <button className="reject" onClick={() => handleReject(b._id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services tab */}
        {activeTab === "services" && (
          <div className="card">
            <h4>Create New Service</h4>
            <form onSubmit={handleServiceSubmit} className="service-form">
              <input
                type="text"
                placeholder="Service name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price (£)"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
              />
              <div>
                <input
                  type="checkbox"
                  checked={newService.ecoFriendly}
                  onChange={(e) =>
                    setNewService({ ...newService, ecoFriendly: e.target.checked })
                  }
                />
               <label>
                 Eco Friendly
                </label>
              </div>
              <button type="submit">Add Service</button>
            </form>

            <h4>My Services</h4>
            {services.map((s) =>
              editingServiceId === s._id ? (
                <div key={s._id} className="job-item editing">
                  <input
                    type="text"
                    value={editedService.name}
                    onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editedService.price}
                    onChange={(e) => setEditedService({ ...editedService, price: e.target.value })}
                  />
                  <textarea
                    value={editedService.description}
                    onChange={(e) =>
                      setEditedService({ ...editedService, description: e.target.value })
                    }
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={editedService.ecoFriendly}
                      onChange={(e) =>
                        setEditedService({ ...editedService, ecoFriendly: e.target.checked })
                      }
                    />
                    Eco-Friendly
                  </label>
                  <button onClick={() => handleUpdate(s._id)}>Update</button>
                  <button onClick={() => setEditingServiceId(null)}>Cancel</button>
                </div>
              ) : (
                <div key={s._id} className="job-item">
                  <p><strong>{s.name}</strong> – £{s.price}</p>
                  <p>{s.description}</p>
                  <span className={`status-pill ${s.ecoFriendly ? "eco" : ""}`}>
                    {s.ecoFriendly ? "Eco Friendly" : "Standard"}
                  </span>
                  <div className="actions">
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(s._id)}>Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="card">
            <h4>Earnings</h4>
            
            <p>Lifetime: <strong>£ {activeProvider?.earnings}</strong></p>
          </div>
        )}


      </div>
    );
  }

  export default ProviderDashboard;

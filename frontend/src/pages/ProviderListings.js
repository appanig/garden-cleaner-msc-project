import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaLeaf, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "./ProviderListings.css";
import { AuthContext } from "../context/AuthContext";

export default function ProviderListings() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);

  const [ecoOnly, setEcoOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/provider/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProviders(res.data);
        setFilteredProviders(res.data);
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };
    fetchProviders();
  }, [token]);

  useEffect(() => {
    let result = providers;

    if (ecoOnly) {
      result = result.filter((p) => p.isEcoFriendly);

    }

    result = result.filter((p) => (p.rating || 0) >= minRating);


    setFilteredProviders(result);
  }, [ecoOnly, minRating, providers]);

  return (
    <div className="provider-listings-page">
      <h2 className="page-title">🌿 Find a Cleaning Professional</h2>

      {/* Filter Bar */}
      <div className="filter-bar">

        <label className="checkbox">
          <input
            type="checkbox"
            checked={ecoOnly}
            onChange={(e) => setEcoOnly(e.target.checked)}
          />
          <FaLeaf /> Eco-Certified Only
        </label>

        <label className="range">
          ⭐ Min Rating: {minRating}
          <input
            type="range"
            min="0"
            max="5"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Providers Grid */}
      <div className="provider-grid">
        {filteredProviders.length === 0 ? (
          <p>No providers match your filters.</p>
        ) : (
          filteredProviders.map((provider) => (
            <div className="provider-card" key={provider._id}>
              <div>
                <img
                  src={provider.user.profilePicture ? "http://localhost:5050" + provider.user.profilePicture : "/profile.png"}
                  alt={provider.user?.name}
                />
                <h3>{provider.user?.name}</h3>
               
                {provider.isEcoFriendly && (
                  <div className="badges">
                    <FaLeaf className="eco-icon" /> Eco Certified
                  </div>
                )}
              </div>
              <p className="bio">{provider.bio || "Outdoor specialist with a focus on eco-friendly services."}</p>
              <div className="services">
                {provider.services.map((service, idx) => (
                  <span key={idx} className="service-tag">
                    {typeof service === 'string' ? service : service.name}
                  </span>
                ))}
              </div>
           
              <div className="rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(provider.rating || 0) ? "#f7c948" : "#ccc"}
                  />
                ))}
                <span>({provider.rating?.toFixed(1) || "N/A"})</span>
              </div>
              <Link to={`/provider-details/${provider._id}`}>
                <button className="view-btn">View Profile</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

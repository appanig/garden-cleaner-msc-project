import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [top3Providers, setTop3Providers] = useState([]);

  useEffect(() => {

    const fetchProviders = async () => {
      const res = await axios.get("http://localhost:5050/api/provider/top-3");

      console.log(res.data);
      setTop3Providers(res.data);

    }

    fetchProviders();
  }, []);
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Eco-Friendly Outdoor Cleaning Made Easy</h1>
          <p>Book trusted professionals and relax while we clean your outdoors.</p>
          <Link to="/book"><button>Book a Service</button></Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="how-steps">
          {["Choose a Service", "Select a Date", "Confirm Booking", "Get Notified"].map((text, index) => (
            <div className="how-step" key={index}>
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">🧹</div>
              <div className="step-text">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem', width: "70%", margin: "0 auto" }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          🏆 Top 3 Service Providers
        </h2>

        <div
          style={{
            display: 'grid',
            gap: '30px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {top3Providers.map((provider, index) => (
            <div
              key={provider.providerId}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(to right, #f7fafc, #e2e8f0)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {/* Profile Image */}
              <img
                src={provider.profilePicture ? `http://localhost:5050${provider.profilePicture}` : "profile.png"} 
                alt={provider.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  marginRight: '20px',
                  objectFit: 'cover',
                  border: '3px solid #3182ce',
                }}
              />

              {/* Info */}
              <div>
                <h3 style={{ margin: '0 0 5px', fontSize: '1.4rem' }}>
                  #{index + 1} - {provider.name}
                </h3>
                <p style={{ margin: '4px 0' }}>
                  <strong>Email:</strong> {provider.email}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Avg Rating:</strong> ⭐ {provider.avgRating.toFixed(1)}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Reviews:</strong> {provider.reviewCount}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Eco-Friendly:</strong>{' '}
                  {provider.isEcoFriendly ? '🌱 Yes' : '❌ No'}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Services Offered:</strong> {provider.services.length}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <h2>Why Choose Us</h2>
        <div className="why-boxes">
          <div className="why-box">🌦️ Weather-Aware Bookings</div>
          <div className="why-box">✅ Verified Professionals</div>
          <div className="why-box">♻️ Eco-Friendly Practices</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Customers Say</h2>
        <div className="testimonial-slider">
          {[1, 2, 3].map((i) => (
            <div className="testimonial-slide" key={i}>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"GardenCleaner made it so easy to book. Loved the results!"</p>
              <div className="customer">
                <img src={`https://i.pravatar.cc/50?img=${i}`} alt="customer" />
                <span>Customer {i}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="final-cta">
        <h2>Ready to Clean Your Garden?</h2>
        <Link to="/book"><button>Start Now</button></Link>
      </section>
    </div>
  );
}

export default Home;

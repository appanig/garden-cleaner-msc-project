import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
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

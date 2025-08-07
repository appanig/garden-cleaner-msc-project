import React, { useContext, useEffect, useState } from "react";
import "./ProviderProfile.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

function ProviderDetails() {
    const [provider, setProvider] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [reviews, setReviews] = useState([]);

    const { token, user } = useContext(AuthContext);

    const { id } = useParams();

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5050/api/provider/us/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setProvider(data);
                setActiveUser(data.user);
                setReviews(data.reviews || []);

            } catch (err) {
                console.error("Error loading provider", err);
            }
        };

        fetchProvider();
    }, [user]);




    if (!provider || !activeUser) return <div className="loading">Loading...</div>;

    return (
        <div className="provider-profile-page">
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <img
                        src={
                            activeUser.profilePicture && 'http://localhost:5050' + activeUser.profilePicture || "/profile.png"
                        }
                        alt="provider"
                        className="avatar-preview"
                    />

                </div>

                <div>
                    <h2>{activeUser.name}</h2>
                    {provider.isEcoFriendly && <p className="badge">✅ Eco Certified</p>}
                    <div className="stars">{Number(provider?.rating) <= 0 ? "Not Rated" : "⭐".repeat(provider?.rating)}</div>
                </div>

            </div>

            {/* Bio */}
            <section className="bio-section">
                <h3>About</h3>

                <p>{provider.bio}</p>

            </section>

            <section className="services-section">
                <h3>Services Offered</h3>
                {provider.services.length === 0 ? (
                    <p>No services listed.</p>
                ) : (
                    <div className="service-cards">
                        {provider.services.map((service) => (
                            <div className="service-card" key={service._id}>
                                <h4>{service.name}</h4>
                                <p>{service.description}</p>
                                <p><strong>£{service.price}</strong></p>
                                {service.ecoFriendly && <span className="badge">Eco-Friendly 🌿</span>}
                            </div>
                        ))}
                    </div>
                )}
            </section>



            {/* Reviews */}
            <section className="reviews-section">
                <h3>Customer Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div className="review-card" key={review._id}>
                            <div className="stars">{"⭐".repeat(review.rating)}</div>
                            <p>{review.comment}</p>
                            <div className="reviewer">– {review.homeowner?.name || "Anonymous"}</div>
                        </div>
                    ))
                )}
            </section>


        </div>
    );
}

export default ProviderDetails;

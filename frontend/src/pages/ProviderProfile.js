import React, { useContext, useEffect, useState } from "react";
import "./ProviderProfile.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function ProviderProfile() {
  const [provider, setProvider] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { token, user } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5050/api/provider/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

     

        setProvider(data);
        setActiveUser(data.user);
        setReviews(data.reviews || []);
        setFormData({
          name: data.user.name,
          bio: data.bio || '',
          location: data.user.location.place || '',
          services: data.services || [],
          isEcoFriendly: data.isEcoFriendly || false,
        });


      } catch (err) {
        console.error("Error loading provider", err);
      }
    };

    fetchProvider();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };



  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("bio", formData.bio);
      
      form.append("isEcoFriendly", formData.isEcoFriendly);
      if (selectedImage) {
        form.append("profilePicture", selectedImage);
      }

      const { data } = await axios.put(
        `http://localhost:5050/api/provider/me`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setActiveUser(data.user);
      setProvider(data);
      setEditMode(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };


  if (!provider || !activeUser) return <div className="loading">Loading...</div>;

  return (
    <div className="provider-profile-page">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : activeUser.profilePicture && 'http://localhost:5050'+activeUser.profilePicture || "/profile.png"
            }
            alt="provider"
            className="avatar-preview"
          />
          {editMode && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
        </div>

        <div>
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="isEcoFriendly"
                  checked={formData.isEcoFriendly}
                  onChange={handleInputChange}
                /> Eco Certified
              </label>
             
            </>
          ) : (
            <>
              <h2>{activeUser.name}</h2>
              {provider.isEcoFriendly && <p className="badge">✅ Eco Certified</p>}
              <div className="stars">{Number(provider?.rating) <=0 ? "Not Rated" :"⭐".repeat(provider?.rating)}</div>

            </>
          )}
        </div>
        <button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
          {editMode ? "Save" : "Edit Profile"}
        </button>
      </div>

      {/* Bio */}
      <section className="bio-section">
        <h3>About</h3>
        {editMode ? (
          <textarea name="bio" value={formData.bio} onChange={handleInputChange} />
        ) : (
          <p>{provider.bio}</p>
        )}
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

export default ProviderProfile;

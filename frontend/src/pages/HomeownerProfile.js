import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiImage } from "react-icons/fi";
import "./HomeownerProfile.css";

export default function HomeownerProfile() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
          profilePicture: res.data.profilePicture || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      if (formData.password) form.append("password", formData.password);
      if (imageFile) form.append("profilePicture", imageFile);

      const res = await axios.put(
        "http://localhost:5050/api/user/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Profile updated successfully!");
      if (res.data.profilePicture) {
        setFormData(prev => ({
          ...prev,
          profilePicture: res.data.profilePicture
        }));
      }
    } catch (err) {
      setMessage("Update failed.");
      console.error("Update error:", err);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form" encType="multipart/form-data">
        <div className="form-group">
          <label><FiUser /> Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label><FiMail /> Email (read-only)</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>

        <div className="form-group">
          <label><FiLock /> New Password</label>
          <input type="password" name="password" placeholder="•••••••" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label><FiImage /> Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {formData.profilePicture && (
            <img
              src={`http://localhost:5050${formData.profilePicture}`}
              alt="Profile"
              style={{ width: "80px", marginTop: "10px", borderRadius: "5px" }}
            />
          )}
        </div>

        <button type="submit" className="update-btn">Update Profile</button>
        {message && <p className="update-message">{message}</p>}
      </form>
    </div>
  );
}

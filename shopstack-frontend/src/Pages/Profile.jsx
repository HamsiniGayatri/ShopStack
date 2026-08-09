import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {

    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {

    const userId = localStorage.getItem("userId");

    axios
        .get(`http://localhost:8080/profile/${userId}`)
            .then((response) => {

                setUser(response.data);
                setFormData(response.data);

            })
            .catch((error) => {

                console.error("Error fetching profile:", error);

            });

    }, []);


    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Open edit mode
    const handleEdit = () => {

        setFormData({ ...user });

        setMessage("");

        setIsEditing(true);
    };


    // Cancel editing
    const handleCancel = () => {

        setFormData({ ...user });

        setMessage("");

        setIsEditing(false);
    };


    // Save profile - frontend functionality for now
    const handleSave = async () => {

    if (!formData.name.trim()) {
        setMessage("Name is required.");
        return;
    }

    if (!formData.email.trim()) {
        setMessage("Email is required.");
        return;
    }

    try {

        const response = await axios.put(
            `http://localhost:8080/profile/${user.id}`,
            formData
        );

        setUser(response.data);

        setFormData(response.data);

        setIsEditing(false);

        setMessage("Profile updated successfully.");

        setTimeout(() => {
            setMessage("");
        }, 3000);

    } catch (error) {

        console.error("Error updating profile:", error);

        setMessage("Unable to update profile.");
    }
};


    if (!user || !formData) {

        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }


    return (

        <div className="profile-page">

            <div className="profile-container">


                {/* ================= HEADER ================= */}

                <div className="profile-header">

                    <div>

                        <h1 className="profile-title">
                            My Profile
                        </h1>

                        <p className="profile-subtitle">
                            Manage your ShopStack account and personal information
                        </p>

                    </div>


                    {!isEditing && (

                        <button
                            className="edit-profile-button"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>

                    )}

                </div>


                {/* ================= MESSAGE ================= */}

                {message && (

                    <div className="profile-message">
                        {message}
                    </div>

                )}


                {/* ================= VIEW MODE ================= */}

                {!isEditing && (

                    <>

                        {/* Account Overview */}

                        <div className="profile-card">

                            <div className="section-heading">
                                Account Overview
                            </div>


                            <div className="profile-grid">


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Account ID
                                    </span>

                                    <div className="profile-value">
                                        #{user.id}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Account Status
                                    </span>

                                    <div className="profile-status">
                                        Active
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Full Name
                                    </span>

                                    <div className="profile-value">
                                        {user.name}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Account Type
                                    </span>

                                    <div className="profile-role">
                                        {user.role}
                                    </div>

                                </div>

                            </div>

                        </div>



                        {/* Contact Information */}

                        <div className="profile-card">

                            <div className="section-heading">
                                Contact Information
                            </div>


                            <div className="profile-grid">


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Email Address
                                    </span>

                                    <div className="profile-value">
                                        {user.email}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Phone Number
                                    </span>

                                    <div className="profile-value">
                                        {user.phoneNumber || "Not provided"}
                                    </div>

                                </div>

                            </div>

                        </div>



                        {/* Address Information */}

                        <div className="profile-card">

                            <div className="section-heading">
                                Address Information
                            </div>


                            <div className="profile-grid">


                                <div className="profile-field profile-field-full">

                                    <span className="profile-label">
                                        Address
                                    </span>

                                    <div className="profile-value">
                                        {user.address || "Not provided"}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        City
                                    </span>

                                    <div className="profile-value">
                                        {user.city || "Not provided"}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        State
                                    </span>

                                    <div className="profile-value">
                                        {user.state || "Not provided"}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Pincode
                                    </span>

                                    <div className="profile-value">
                                        {user.pincode || "Not provided"}
                                    </div>

                                </div>


                                <div className="profile-field">

                                    <span className="profile-label">
                                        Country
                                    </span>

                                    <div className="profile-value">
                                        {user.country || "Not provided"}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </>

                )}



                {/* ================= EDIT MODE ================= */}

                {isEditing && (

                    <div className="profile-card">

                        <div className="section-heading">
                            Edit Profile
                        </div>


                        <div className="profile-grid">


                            {/* Name */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    Full Name
                                </label>

                                <input
                                    className="profile-input"
                                    type="text"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />

                            </div>



                            {/* Email */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    Email Address
                                </label>

                                <input
                                    className="profile-input"
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />

                            </div>



                            {/* Phone */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    Phone Number
                                </label>

                                <input
                                    className="profile-input"
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ""}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />

                            </div>



                            {/* City */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    City
                                </label>

                                <input
                                    className="profile-input"
                                    type="text"
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                />

                            </div>



                            {/* State */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    State
                                </label>

                                <input
                                    className="profile-input"
                                    type="text"
                                    name="state"
                                    value={formData.state || ""}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                />

                            </div>



                            {/* Pincode */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    Pincode
                                </label>

                                <input
                                    className="profile-input"
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode || ""}
                                    onChange={handleChange}
                                    placeholder="Enter pincode"
                                />

                            </div>



                            {/* Country */}

                            <div className="profile-field">

                                <label className="profile-label">
                                    Country
                                </label>

                                <input
                                    className="profile-input"
                                    type="text"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleChange}
                                    placeholder="Enter country"
                                />

                            </div>



                            {/* Address */}

                            <div className="profile-field profile-field-full">

                                <label className="profile-label">
                                    Address
                                </label>

                                <textarea
                                    className="profile-textarea"
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your complete address"
                                    rows="4"
                                />

                            </div>

                        </div>



                        {/* Actions */}

                        <div className="profile-actions">

                            <button
                                className="save-profile-button"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>


                            <button
                                className="cancel-profile-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Profile;
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = ({ user, setUser }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        profileImageUrl: user?.profileImageUrl || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        const storedUser = user || JSON.parse(localStorage.getItem('userData'));
        if (storedUser) {
            setFormData(prev => ({
                ...prev,
                fullName: storedUser.fullName || '',
                email: storedUser.email || '',
                profileImageUrl: storedUser.profileImageUrl || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "orange_preset"); 
        data.append("cloud_name", "dsmreztod"); 

        setLoading(true);
        try {
            const resp = await fetch("https://api.cloudinary.com/v1_1/dsmreztod/image/upload", {
                method: "POST",
                body: data
            });
            const fileData = await resp.json();
            setFormData({ ...formData, profileImageUrl: fileData.secure_url });
            alert("Image uploaded successfully!");
        } catch (err) {
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }

        setLoading(true);
        const currentUserId = user?.id || localStorage.getItem('id');
        
        try {
            const response = await api.put(`/User/update-profile/${currentUserId}`, formData);
            if (response.data) {
                alert("Profile updated successfully!");
                const updatedUser = {
                    ...user,
                    fullName: formData.fullName,
                    email: formData.email,
                    profileImageUrl: formData.profileImageUrl
                };
                setUser(updatedUser);
                setIsEditMode(false);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    const btnStyle = {
        backgroundColor: '#ff6600',
        color: 'white',
        border: 'none',
        fontWeight: 'bold',
        transition: '0.3s',
        borderRadius: '8px'
    };

    return (
        <div className="container mt-5 px-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                        <div className="card-header bg-dark d-flex justify-content-between align-items-center py-3 px-4">
                            <h4 className="mb-0" style={{ color: '#ff6600' }}>My Profile</h4>
                            {!isEditMode && (
                                <button 
                                    className="btn btn-sm" 
                                    style={{ border: '2px solid #ff6600', color: '#ff6600', fontWeight: 'bold' }}
                                    onMouseOver={(e) => { e.target.style.backgroundColor = '#ff6600'; e.target.style.color = 'white'; }}
                                    onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ff6600'; }}
                                    onClick={() => setIsEditMode(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <div className="position-relative d-inline-block">
                                    <img 
                                        src={formData.profileImageUrl || 'https://via.placeholder.com/150'} 
                                        alt="Profile" 
                                        className="rounded-circle border border-4"
                                        style={{ width: '130px', height: '130px', objectFit: 'cover', borderColor: '#ff6600' }}
                                    />
                                    {isEditMode && (
                                        <label className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow" 
                                               style={{ cursor: 'pointer', backgroundColor: '#ff6600', color: 'white' }}>
                                            <i className="fa fa-camera"></i>
                                            <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                                <h5 className="mt-2 fw-bold">{formData.fullName || "User Name"}</h5>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Full Name</label>
                                        <input type="text" name="fullName" className="form-control bg-light" 
                                            value={formData.fullName} onChange={handleChange} disabled={!isEditMode} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Email Address</label>
                                        <input type="email" name="email" className="form-control bg-light" 
                                            value={formData.email} onChange={handleChange} disabled={!isEditMode} required />
                                    </div>

                                    {isEditMode && (
                                        <>
                                            <div className="bg-light p-3 rounded-3 mt-4">
                                                <h6 className="fw-bold mb-3" style={{ color: '#ff6600' }}>Security Settings</h6>
                                                <div className="mb-3">
                                                    <label className="small fw-bold">Current Password</label>
                                                    <input type="password" name="currentPassword" 
                                                        className="form-control" value={formData.currentPassword} onChange={handleChange} required />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="small fw-bold">New Password</label>
                                                        <input type="password" name="newPassword" 
                                                            className="form-control" value={formData.newPassword} onChange={handleChange} />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="small fw-bold">Confirm New Password</label>
                                                        <input type="password" name="confirmNewPassword" 
                                                            className="form-control" value={formData.confirmNewPassword} onChange={handleChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 mt-4 d-flex gap-2">
                                                <button 
                                                    type="submit" 
                                                    disabled={loading} 
                                                    className="btn flex-grow-1 py-2 shadow-sm" 
                                                    style={btnStyle}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#e65c00'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff6600'}
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button type="button" className="btn btn-secondary py-2" onClick={() => setIsEditMode(false)}>Cancel</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
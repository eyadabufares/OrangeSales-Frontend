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
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.email || '',
                profileImageUrl: user.profileImageUrl || ''
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
            alert("تم رفع الصورة بنجاح! لا تنسى حفظ التعديلات في الأسفل.");
        } catch (err) {
            console.error(err);
            alert("فشل رفع الصورة");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmNewPassword) {
            alert("كلمات السر الجديدة غير متطابقة!");
            return;
        }

        setLoading(true);
        try {
            const response = await api.put(`/User/update-profile/${user.id}`, formData);

            if (response.data.success) {
                alert("تم تحديث البيانات بنجاح!");
                
                setUser({
                    ...user,
                    fullName: response.data.updatedFullName,
                    email: response.data.updatedEmail,
                    profileImageUrl: response.data.updatedProfileImageUrl
                });
                setIsEditMode(false); 
            }
        } catch (error) {
            alert(error.response?.data?.message || "فشل التحديث. تأكد من كلمة السر الحالية.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 px-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                        <div className="card-header bg-dark d-flex justify-content-between align-items-center py-3 px-4">
                            <h4 className="mb-0" style={{ color: '#ff6600' }}>My Profile</h4>
                            {!isEditMode && (
                                <button className="btn btn-sm btn-outline-warning" onClick={() => setIsEditMode(true)}>
                                    <i className="fa fa-edit"></i> Edit Profile
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
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    {isEditMode && (
                                        <label className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-2 shadow" style={{ cursor: 'pointer', backgroundColor: '#ff6600', color: '#fff' }}>
                                            <i className="fa fa-camera"></i>
                                            <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                                <h5 className="mt-2 fw-bold">{user?.fullName || "Loading..."}</h5>
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
                                        <div className="bg-light p-3 rounded-3 mt-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#ff6600' }}>Change Password</h6>
                                            <div className="mb-3">
                                                <label className="small fw-bold">Current Password</label>
                                                <input type="password" name="currentPassword" placeholder="كلمة السر الحالية" 
                                                    className="form-control" value={formData.currentPassword} onChange={handleChange} required />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="small fw-bold">New Password</label>
                                                    <input type="password" name="newPassword" placeholder="الجديدة" 
                                                        className="form-control" value={formData.newPassword} onChange={handleChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="small fw-bold">Confirm New Password</label>
                                                    <input type="password" name="confirmNewPassword" placeholder="تأكيد الجديدة" 
                                                        className="form-control" value={formData.confirmNewPassword} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isEditMode && (
                                        <div className="col-12 mt-4 d-flex gap-2">
                                            <button type="submit" disabled={loading} className="btn flex-grow-1 fw-bold" 
                                                style={{ backgroundColor: '#ff6600', color: '#fff' }}>
                                                {loading ? 'Processing...' : 'Save Changes'}
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditMode(false)}>Cancel</button>
                                        </div>
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
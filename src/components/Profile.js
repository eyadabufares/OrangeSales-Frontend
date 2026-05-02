import React, { useState } from 'react';
import api from '../utils/api';

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        profileImageUrl: user?.profileImageUrl || ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "فشل في تحديث البيانات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 px-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-header bg-dark py-4 text-center">
                            <h3 className="fw-bold mb-0" style={{ color: '#ff6600' }}>
                                Edit <span className="text-white">Profile</span>
                            </h3>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit}>
                                <div className="text-center mb-4">
                                    <img 
                                        src={formData.profileImageUrl || 'https://via.placeholder.com/150'} 
                                        alt="Profile" 
                                        className="rounded-circle border border-4"
                                        style={{ width: '130px', height: '130px', objectFit: 'cover', borderColor: '#ff6600' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    <p className="small text-muted mt-2">معاينة الصورة الشخصية</p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Full Name</label>
                                    <input type="text" name="fullName" className="form-control form-control-lg bg-light border-0" 
                                        value={formData.fullName} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Email Address</label>
                                    <input type="email" name="email" className="form-control form-control-lg bg-light border-0" 
                                        value={formData.email} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Profile Image URL</label>
                                    <input type="text" name="profileImageUrl" placeholder="إلصق رابط صورتك هنا (FB, LinkedIn, etc.)" 
                                        className="form-control form-control-lg bg-light border-0" 
                                        value={formData.profileImageUrl} onChange={handleChange} style={{ borderRadius: '12px' }} />
                                </div>

                                <hr className="my-4" />

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Current Password (Required)</label>
                                    <input type="password" name="currentPassword" placeholder="تأكيد كلمة السر الحالية" 
                                        className="form-control form-control-lg bg-light border-0" 
                                        value={formData.currentPassword} onChange={handleChange} required style={{ borderRadius: '12px' }} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted">New Password (Optional)</label>
                                    <input type="password" name="newPassword" placeholder="اتركه فارغاً للإبقاء على الحالية" 
                                        className="form-control form-control-lg bg-light border-0" 
                                        value={formData.newPassword} onChange={handleChange} style={{ borderRadius: '12px' }} />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="btn btn-lg w-100 fw-bold shadow-sm"
                                    style={{ 
                                        backgroundColor: '#1a1a1a', 
                                        color: '#ff6600', 
                                        border: '2px solid #ff6600', 
                                        borderRadius: '12px',
                                        height: '55px',
                                        transition: '0.3s'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ff6600'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; e.currentTarget.style.color = '#ff6600'; }}
                                >
                                    {loading ? 'جاري التحديث...' : 'حفظ التعديلات'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
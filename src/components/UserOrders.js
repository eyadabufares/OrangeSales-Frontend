import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 

const UserOrders = ({ userId, onViewReport }) => { 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await api.get(`/Order/user/${userId}`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const handleDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await api.delete(`/Order/${orderId}`);
                setOrders(orders.filter(order => order.orderId !== orderId));
                alert("Order deleted successfully!");
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete order.");
            }
        }
    };

    const renderAiStatus = (status, reason) => {
        const badgeStyle = { 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center'
        };
        
        switch (status?.toLowerCase()) {
            case 'valid':
            case 'validated':
                return <span className="badge bg-success text-white" style={badgeStyle} title="Verified by AI">
                          <i className="fa fa-check-circle me-1"></i> Valid
                       </span>;
            case 'not valid':
            case 'rejected':
                return <span className="badge bg-danger text-white" style={badgeStyle} title={reason}>
                          <i className="fa fa-times-circle me-1"></i> Rejected
                       </span>;
            case 'system busy':
            case 'busy':
                return <span className="badge bg-warning text-dark" style={badgeStyle}>
                          <i className="fa fa-hourglass-half me-1"></i> Busy
                       </span>;
            default:
                return <span className="badge bg-secondary text-white" style={badgeStyle}>
                          <i className="fa fa-clock-o me-1"></i> Pending
                       </span>;
        }
    };

    if (loading) return <div className="text-center mt-5 py-5"><div className="spinner-border text-orange" role="status"></div><p className="mt-2">Loading your orders...</p></div>;

    return (
        <div className="container-fluid px-3 px-md-5 mt-4">
            <div className="d-flex align-items-center mb-4" style={{ borderLeft: '5px solid #ff6600', paddingLeft: '15px' }}>
                <h2 className="fw-bold mb-0 fs-3 fs-md-2" style={{ color: '#000000' }}>
                    My Orders <span style={{ color: '#ff6600' }}>History</span>
                </h2>
            </div>

            {orders.length === 0 ? (
                <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                    You haven't placed any orders yet.
                </div>
            ) : (
                <>
                    <div className="d-none d-md-block card shadow-sm border-0 mb-5" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0 text-center"> 
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 py-3 text-uppercase small fw-bold text-start">Order ID</th>
                                        <th className="py-3 text-uppercase small fw-bold">Total Price</th>
                                        <th className="py-3 text-uppercase small fw-bold">AI Validation</th>
                                        <th className="pe-4 py-3 text-uppercase small fw-bold text-center" style={{ width: '250px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="ps-4 fw-bold text-start">#{order.orderId}</td>
                                            <td className="fw-bold">{order.total.toFixed(2)} JOD</td>
                                            <td>{renderAiStatus(order.aiStatus, order.aiReason)}</td>
                                            <td className="pe-4 text-center">
                                                <button 
                                                    className="btn btn-sm fw-bold px-3 me-2"
                                                    style={{ 
                                                        backgroundColor: '#1a1a1a', 
                                                        color: '#ff6600', 
                                                        border: '2px solid #ff6600', 
                                                        borderRadius: '8px',
                                                        transition: '0.3s'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#ff6600';
                                                        e.currentTarget.style.color = '#ffffff';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#1a1a1a';
                                                        e.currentTarget.style.color = '#ff6600';
                                                    }}
                                                    onClick={() => onViewReport(order.orderId)}
                                                >
                                                    <i className="fa fa-file-text-o me-1"></i> View Report
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger btn-sm fw-bold px-3"
                                                    style={{ borderRadius: '8px', borderWidth: '2px' }}
                                                    onClick={() => handleDelete(order.orderId)}
                                                >
                                                    <i className="fa fa-trash me-1"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-md-none">
                        {orders.map((order) => (
                            <div key={order.orderId} className="card shadow-sm border-0 mb-3 p-3" style={{ borderRadius: '12px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold text-dark">Order #{order.orderId}</span>
                                    {renderAiStatus(order.aiStatus, order.aiReason)}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <span className="text-muted small d-block">Total Amount</span>
                                        <span className="fw-bold h5 mb-0" style={{ color: '#ff6600' }}>{order.total.toFixed(2)} JOD</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-dark btn-sm rounded-3 px-3"
                                            style={{ backgroundColor: '#1a1a1a', color: '#ff6600', border: '1px solid #ff6600' }}
                                            onClick={() => onViewReport(order.orderId)}
                                        >
                                            View Report
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm rounded-circle shadow-sm"
                                            style={{ width: '35px', height: '35px' }}
                                            onClick={() => handleDelete(order.orderId)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserOrders;
import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 

const AiSettings = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchCurrentPrompt = async () => {
            try {
                const response = await api.get('/AiSettings');
                setPrompt(response.data.prompt);
            } catch (error) {
                console.error("Error fetching prompt:", error);
                setMessage({ type: 'danger', text: 'Failed to load current AI settings.' });
            }
        };
        fetchCurrentPrompt();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/AiSettings/update', {
                newPrompt: prompt
            });
            setMessage({ type: 'success', text: 'AI Validation rules updated successfully!' });
        } catch (error) {
            console.error("Error updating prompt:", error);
            setMessage({ type: 'danger', text: 'Error updating settings. Check API connection.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-3 px-md-5 mt-4 mt-md-5">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-3 p-md-5">
                            
                            <div className="d-flex align-items-center mb-4" style={{ borderLeft: '5px solid #ff6600', paddingLeft: '15px' }}>
                                <h2 className="fw-bold mb-0 fs-3 fs-md-2" style={{ color: '#000000' }}>
                                    AI Validator <span style={{ color: '#ff6600' }}>Settings</span>
                                </h2>
                            </div>

                            <p className="text-muted mb-4 px-2">
                                Configure the rules that the AI will use to validate orders. 
                                Changes here will affect all new orders immediately.
                            </p>

                            {message.text && (
                                <div className={`alert alert-${message.type} alert-dismissible fade show shadow-sm mb-4`} role="alert">
                                    <small className="fw-bold">{message.text}</small>
                                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                                </div>
                            )}

                            <div className="mb-4 px-1 px-md-2">
                                <label className="form-label fw-bold small text-uppercase mb-3" style={{ color: '#ff6600', letterSpacing: '1px' }}>
                                    AI Instruction Template (Prompt)
                                </label>
                                <textarea 
                                    className="form-control shadow-sm border-0" 
                                    rows="10" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    style={{ 
                                        fontSize: '0.95rem', 
                                        borderRadius: '12px',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        lineHeight: '1.6',
                                        minHeight: '250px'
                                    }}
                                    placeholder="Write the validation rules here..."
                                ></textarea>
                                <div className="form-text mt-3 text-muted bg-light p-2 rounded">
                                    <i className="fa fa-info-circle me-1"></i>
                                    <strong>Note:</strong> Be specific about Price, Quantity, and the JSON return format.
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-2">
                                <button 
                                    className="btn w-100 w-md-auto px-md-5 py-3 shadow-sm"
                                    disabled={loading}
                                    onClick={handleSave}
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        color: '#ff6600',
                                        border: '2px solid #ff6600',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
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
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span> Saving...</>
                                    ) : (
                                        <><i className="fa fa-save me-2"></i> Update AI Rules</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiSettings;
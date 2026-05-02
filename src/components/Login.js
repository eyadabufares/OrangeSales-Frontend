import React, { useState } from 'react';
import api from '../utils/api'; 

const Login = ({ onSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/Auth/login', {
        email, password
      });

      if (response.data) {
        const userData = response.data;
        const userId = userData.userId || userData.id || userData.user?.id;

        if (userId) {
          localStorage.setItem('userId', userId);
          localStorage.setItem('id', userId);
          
          alert(userData.message || "Login Successful");
          
          onLoginSuccess(userData); 
        } else {
          alert("Error: User ID not received from server.");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100 px-3">
        <div className="col-12" style={{ maxWidth: '400px' }}>
          <div className="card p-4 shadow-lg border-0" style={{ borderRadius: '20px', backgroundColor: '#ffffff' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-1" style={{ color: '#000000' }}>
                Login to <span style={{ color: '#ff6600' }}>Orange</span>
              </h2>
              <p className="text-muted small">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3 text-start">
                <label className="form-label small fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg border-0 bg-light" 
                  style={{ fontSize: '0.9rem', borderRadius: '10px' }}
                  placeholder="name@orange.com"
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4 text-start">
                <label className="form-label small fw-bold">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg border-0 bg-light" 
                  style={{ fontSize: '0.9rem', borderRadius: '10px' }}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <button 
                type="submit"
                className="btn w-100 py-3 fw-bold shadow-sm"
                style={{ 
                  backgroundColor: '#ff6600', 
                  color: '#ffffff', 
                  borderRadius: '12px',
                  border: 'none',
                  transition: '0.3s'
                }}
              >
                Sign In
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-muted small">Don't have an account? </span>
              <button 
                className="btn btn-link p-0 fw-bold text-decoration-none small" 
                style={{ color: '#ff6600' }} 
                onClick={onSwitch}
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
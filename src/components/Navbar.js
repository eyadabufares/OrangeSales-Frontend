import React, { useState } from 'react';

const Navbar = ({ onLogout, onNavigate, user }) => { 
  const [isOpen, setIsOpen] = useState(false);

  const navStyle = {
    backgroundColor: '#000000',
    borderBottom: '4px solid #ff6600',
    padding: '10px 0'
  };

  const brandStyle = {
    color: '#ff6600',
    fontWeight: 'bold',
    fontSize: '1.6rem',
    cursor: 'pointer'
  };

  const linkStyle = {
    color: '#ffffff',
    fontWeight: '500',
    margin: '5px 10px',
    background: 'none',
    border: 'none',
    textAlign: 'left'
  };

  const aiLinkStyle = {
    color: '#ff6600', 
    fontWeight: 'bold',
    margin: '5px 10px',
    background: 'none',
    border: 'none',
    borderBottom: '1px dashed #ff6600',
    textAlign: 'left'
  };

  const logoutBtnStyle = {
    color: '#ff6600',
    border: '2px solid #ff6600',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    padding: '5px 20px',
    borderRadius: '5px',
    transition: '0.3s',
    marginTop: '5px'
  };

  const profileThumbStyle = {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ff6600',
    cursor: 'pointer',
    marginRight: '10px'
  };

  return (
    <nav className="navbar navbar-expand-lg mb-4 shadow sticky-top" style={navStyle}>
      <div className="container">
        <span style={brandStyle} onClick={() => onNavigate('dashboard')}>
          Orange Sales
        </span>

        <button 
          className="navbar-toggler" 
          type="button" 
          style={{ border: '1px solid #ff6600' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="fa fa-bars" style={{ color: '#ff6600' }}></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <div className="navbar-nav me-auto">
            <button style={linkStyle} className="btn" onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}>Home</button>
            <button style={linkStyle} className="btn" onClick={() => { onNavigate('orders'); setIsOpen(false); }}>Place Order</button>
            <button style={linkStyle} className="btn" onClick={() => { onNavigate('my-orders'); setIsOpen(false); }}>My Orders</button>
            <button style={linkStyle} className="btn" onClick={() => { onNavigate('reports'); setIsOpen(false); }}>Reports</button>
            <button style={linkStyle} className="btn" onClick={() => { onNavigate('profile'); setIsOpen(false); }}>Profile</button>

            <button style={aiLinkStyle} className="btn" onClick={() => { onNavigate('ai-settings'); setIsOpen(false); }}>
              <i className="fa fa-robot"></i> AI Settings
            </button>
          </div>

          <div className="d-flex align-items-center">
            {user && (
                <div 
                    className="d-flex align-items-center me-3" 
                    onClick={() => onNavigate('profile')}
                    style={{ cursor: 'pointer' }}
                >
                    <img 
                        src={user.profileImageUrl || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        style={profileThumbStyle} 
                    />
                    <span className="text-white small fw-bold d-none d-sm-inline">
                        {user?.fullName ? user.fullName.split(' ')[0] : 'User'}
                    </span>
                </div>
            )}

            <button 
              style={logoutBtnStyle} 
              className="btn w-100-mobile"
              onMouseOver={(e) => { e.target.style.backgroundColor = '#ff6600'; e.target.style.color = '#ffffff'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ff6600'; }}
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
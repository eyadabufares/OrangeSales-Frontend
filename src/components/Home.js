import React from 'react';

const Home = ({ onNavigate }) => {
  const cardStyle = {
    cursor: 'pointer',
    backgroundColor: '#fff',
    borderRadius: '15px',
    transition: '0.3s'
  };

  const iconCircleStyle = {
    width: '70px',
    height: '70px',
    backgroundColor: 'rgba(255, 102, 0, 0.1)', 
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '2rem'
  };

  return (
    <div className="container text-center mt-4 mt-md-5" style={{ minHeight: '75vh' }}>
      <div className="mb-5 px-2">
        <h1 className="fw-bold text-dark fs-2 fs-md-1">
          Welcome to <span style={{color: '#ff6600'}}>Orange</span> Sales
        </h1>
        <p className="text-muted small px-md-5">Manage your sales, orders, and AI verification from one dashboard</p>
      </div>
      
      <div className="row g-4 justify-content-center px-2">
        <div className="col-12 col-md-6 col-lg-5">
          <div 
            className="card h-100 shadow-sm p-4 border-0 home-card" 
            onClick={() => onNavigate('orders')} 
            style={cardStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={iconCircleStyle}>🛒</div>
            <h3 className="fw-bold fs-4" style={{ color: '#ff6600' }}>New Order</h3>
            <p className="text-muted small">
              Create new orders and manage customer transactions seamlessly.
            </p>
            <button className="btn w-100 fw-bold mt-auto py-2" style={{ backgroundColor: '#ff6600', color: '#fff', borderRadius: '8px', border: 'none' }}>
              Get Started
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-5">
          <div 
            className="card h-100 shadow-sm p-4 border-0 home-card" 
            onClick={() => onNavigate('reports')} 
            style={cardStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={iconCircleStyle}>📊</div>
            <h3 className="fw-bold fs-4" style={{ color: '#ff6600' }}>Sales Reports</h3>
            <p className="text-muted small">
              Analyze your business performance and generate detailed summaries.
            </p>
            <button className="btn w-100 fw-bold mt-auto py-2" style={{ backgroundColor: '#ff6600', color: '#fff', borderRadius: '8px', border: 'none' }}>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
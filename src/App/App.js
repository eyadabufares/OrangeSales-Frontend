import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import Home from '../components/Home';
import Navbar from '../components/Navbar';
import PlaceOrder from '../components/PlaceOrder';
import Reports from '../components/Reports';
import UserOrders from '../components/UserOrders'; 
import AiSettings from '../components/AiSettings'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userId, setUserId] = useState(null); 

  const handleLoginSuccess = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowRegister(false);
    setUserId(null); 
    setCurrentPage('home'); 
  };

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        {isLoggedIn ? (
          <>
            <Navbar onLogout={handleLogout} onNavigate={setCurrentPage} />
            <div className="container">
              {(currentPage === 'home' || currentPage === 'dashboard') && <Home onNavigate={setCurrentPage} />}
              {currentPage === 'orders' && <PlaceOrder userId={userId} />} 
              {currentPage === 'reports' && <Reports />}
              {currentPage === 'my-orders' && <UserOrders userId={userId} />}
              
              {currentPage === 'ai-settings' && <AiSettings />}
            </div>
          </>
        ) : (
          <div className="container d-flex justify-content-center align-items-center vh-100">
            <div style={{ width: '450px' }}>
              {showRegister ? (
                <Register onSwitch={() => setShowRegister(false)} />
              ) : (
                <Login 
                  onSwitch={() => setShowRegister(true)} 
                  onLoginSuccess={handleLoginSuccess} 
                />
              )}
            </div>
          </div>
        )}
      </div>

      <footer style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          textAlign: 'center',
          padding: '20px 0',
          marginTop: '50px',
          borderTop: '4px solid #ff6600'
      }}>
          <div className="container">
              <p className="mb-1" style={{ fontWeight: '500' }}>
                  © {new Date().getFullYear()} <span style={{ color: '#ff6600' }}>Orange Sales System</span>
              </p>
              <p style={{ fontSize: '0.9rem', color: '#bbb', marginBottom: 0 }}>
                  Developed by <span style={{ color: '#fff', fontWeight: 'bold' }}>Eyad Abufares</span>
              </p>
          </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import Home from '../components/Home';
import Navbar from '../components/Navbar';
import PlaceOrder from '../components/PlaceOrder';
import Reports from '../components/Reports';
import UserOrders from '../components/UserOrders'; 
import AiSettings from '../components/AiSettings'; 
import Profile from '../components/Profile'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId') !== null;
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedOrderId, setSelectedOrderId] = useState(null); 

  const handleLoginSuccess = (user) => {
    const extractedId = user?.id || user?.userId || user; 
    
    if (!extractedId) {
        console.error("Login Error: No User ID found in response");
        return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', extractedId);
    
    const finalUserData = typeof user === 'object' ? user : { id: extractedId };
    localStorage.setItem('userData', JSON.stringify(finalUserData));

    setUserId(extractedId);
    setUserData(finalUserData); 
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    setShowRegister(false);
    setUserId(null); 
    setUserData(null);
    setSelectedOrderId(null); 
    setCurrentPage('home'); 
  };

  const navigateToReport = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentPage('reports');
  };

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        {isLoggedIn ? (
          <>
            <Navbar 
              user={userData} 
              onLogout={handleLogout} 
              onNavigate={(page) => {
                setCurrentPage(page);
                if (page !== 'reports') setSelectedOrderId(null);
              }} 
            />
            
            <div className="container">
              {(currentPage === 'home' || currentPage === 'dashboard') && <Home onNavigate={setCurrentPage} />}
              
              {currentPage === 'orders' && <PlaceOrder userId={userId} />} 
              
              {currentPage === 'reports' && <Reports initialOrderId={selectedOrderId} />}
              
              {currentPage === 'my-orders' && (
                <UserOrders 
                  userId={userId} 
                  onViewReport={navigateToReport} 
                />
              )}
              
              {currentPage === 'ai-settings' && <AiSettings />}

              {currentPage === 'profile' && (
                <Profile 
                  user={userData} 
                  setUser={(updatedUser) => {
                    setUserData(updatedUser);
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    if (updatedUser.id) {
                        setUserId(updatedUser.id);
                        localStorage.setItem('userId', updatedUser.id);
                    }
                  }} 
                />
              )}
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
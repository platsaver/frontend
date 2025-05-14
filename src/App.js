import React, { useState, useEffect } from 'react';
import CheckUsername from './CheckUserName';
import CheckPassword from './CheckPassword';
import Admin from './Admin';

const App = () => {
  const [step, setStep] = useState('username');
  const [authData, setAuthData] = useState(null);
  const [user, setUser] = useState(null);

  // Kiểm tra phiên đăng nhập khi tải trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/verify-session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Session valid') {
            setUser(data.user);
            setStep('loggedIn');
          } else {
            localStorage.removeItem('token');
            setStep('username');
          }
        })
        .catch(err => {
          console.error('Session verification failed:', err);
          localStorage.removeItem('token');
          setStep('username');
        });
    }
  }, []);

  const handleNext = (data) => {
    setAuthData(data);
    setStep('password');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setStep('loggedIn');
  };

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        localStorage.removeItem('token');
        setUser(null);
        setAuthData(null);
        setStep('username');
      })
      .catch(err => {
        console.error('Logout failed:', err);
      });
  };

  return (
    <div>
      {step === 'username' && <CheckUsername onNext={handleNext} />}
      {step === 'password' && authData && (
        <CheckPassword
          username={authData.username}
          device_id={authData.device_id}
          access_code={authData.access_code}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {step === 'loggedIn' && user && (
        <Admin username={user.username} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
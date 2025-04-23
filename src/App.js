import React, { useState } from 'react';
import Admin from './Admin.jsx';
import CheckUsername from './CheckUserName.jsx';
import CheckPassword from './CheckPassword.jsx';
import '@ant-design/v5-patch-for-react-19';

const App = () => {
  const [step, setStep] = useState('username');
  const [username, setUsername] = useState(''); // Store username

  const handleUsernameNext = (username) => {
    setUsername(username); // Save username
    setStep('password');
  };

  const handlePasswordNext = () => {
    setStep('admin');
  };

  return (
    <div>
      {step === 'username' && <CheckUsername onNext={handleUsernameNext} />}
      {step === 'password' && (
        <CheckPassword username={username} onSuccess={handlePasswordNext} />
      )}
      {step === 'admin' && <Admin />}
    </div>
  );
};

export default App;
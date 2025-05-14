import React, { useState } from 'react';
import CheckUsername from './CheckUserName';
import CheckPassword from './CheckPassword';

const App = () => {
  const [step, setStep] = useState('username');
  const [authData, setAuthData] = useState(null);

  const handleNext = (data) => {
    setAuthData(data);
    setStep('password');
  };

  return (
    <div>
      {step === 'username' && <CheckUsername onNext={handleNext} />}
      {step === 'password' && authData && (
        <CheckPassword
          username={authData.username}
          device_id={authData.device_id}
          access_code={authData.access_code}
        />
      )}
    </div>
  );
};

export default App;
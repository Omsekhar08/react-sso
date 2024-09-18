import React from 'react';
import { initiateOAuthLogin } from './api';

const Login = () => {
  const handleLogin = () => {
    initiateOAuthLogin();
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with SSO</button>
    </div>
  );
};

export default Login;
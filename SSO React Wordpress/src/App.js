// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import { exchangeCodeForToken } from './api';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
     
      const token = localStorage.getItem('token');
      console.log('Checking auth, token:', token);
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();

    // Check for authorization code and state in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      exchangeCodeForToken(code, state)
        .then(() => {
          console.log('Token exchange successful');
          setIsAuthenticated(true);
          // Remove code and state from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(error => {
          console.error('Error exchanging code for token:', error);
          setIsAuthenticated(false);
        });
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log('Is authenticated:', isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
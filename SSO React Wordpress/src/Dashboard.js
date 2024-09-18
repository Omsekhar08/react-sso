import React, { useEffect, useState } from 'react';
import { logout, fetchUserDetails } from './api';

const Dashboard = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserDetails();
        setUserData(data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again later.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [setIsAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <p>Details: {error.toString()}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  if (!userData) {
    return <div>No user data available. Please log in.</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {userData.display_name || userData.username || 'User'}!</p>
      <p>Email: {userData.email || 'N/A'}</p>
      <p>User ID: {userData.id}</p>
      <p>First Name: {userData.first_name || 'N/A'}</p>
      <p>Last Name: {userData.last_name || 'N/A'}</p>
      <p>Roles: {userData.roles.join(', ')}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
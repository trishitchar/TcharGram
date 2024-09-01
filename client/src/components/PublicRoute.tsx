// src/components/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  // Implement your authentication logic here
  return !!localStorage.getItem('authToken'); // Example check
};

const PublicRoute: React.FC = () => {
  return !isAuthenticated() ? <Outlet /> : <Navigate to="/profile" />;
};

export default PublicRoute;

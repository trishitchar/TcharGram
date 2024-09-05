import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Feed from './pages/Feed';
import { auth } from '@/middleware/auth';

const App: React.FC = () => {
  const { isAuthenticated } = auth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/feed" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/feed" /> : <Register />} />
      {isAuthenticated && (
        <>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile/:id" element={<Profile />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

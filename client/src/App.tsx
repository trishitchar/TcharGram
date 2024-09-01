import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { useAuthMiddleware } from './middleware/useAuthMiddleware';
import Feed from './pages/Feed';

const App: React.FC = () => {
  // useAuthMiddleware();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path='error' element={<NotFound/>} />
      <Route path='/feed' element={<Feed/>} />
    </Routes>
  );
};

export default App;

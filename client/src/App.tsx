import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Landing />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path='error' element={<NotFound/>} />
    </Routes>
  );
};

export default App;

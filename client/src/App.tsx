import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/middleware/auth';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Feed from './pages/Feed';
import ExplorePeoplePage from './components/rightFeed/ExplorePeoplePage';
import ProtectedLayout from './ProtectedLayout';
import Chat from './pages/Chat';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicOnlyRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/feed" /> : element;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnlyRoute element={<Login />} />} />
      <Route path="/register" element={<PublicOnlyRoute element={<Register />} />} />
      
      <Route path="/" element={<ProtectedRoute element={<ProtectedLayout />} />}>
        <Route path="feed" element={<Feed />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="explore/people" element={<ExplorePeoplePage />} />
        <Route path="/chat" element={<Chat />} />
        {/* <Route path="/direct/inbox" element={<Chat />} /> */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
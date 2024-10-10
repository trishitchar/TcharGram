import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/middleware/auth';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Feed from './pages/Feed';
import ExplorePeoplePage from './components/feed/rightFeed/ExplorePeoplePage';
import ProtectedLayout from './ProtectedLayout';
import Chat from './pages/Chat';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { baseURL } from './data/data';
import { setSocket, clearSocket } from './redux/slices/socketSlice';
import { setOnlineUsers } from './redux/slices/chatSlice';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicOnlyRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/feed" /> : element;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    if (currentUser) {
      socketRef.current = io(baseURL, {
        query: {
          userId: currentUser._id,
        },
        transports: ['websocket'],
      });
      dispatch(setSocket(socketRef.current));

      // Handle receiving the list of online users
      socketRef.current.on('onlineUsers', (onlineUsers: string[]) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      

      // Clean up socket when component is unmounted or user logs out
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
        dispatch(clearSocket());
      };
    }
  }, [currentUser, dispatch]);

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
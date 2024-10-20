import React, { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/middleware/auth';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { baseURL } from './data/data';
import { setSocket, clearSocket } from './redux/slices/socketSlice';
import { setOnlineUsers, addMessage } from './redux/slices/chatSlice';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Feed from './pages/Feed';
import ExplorePeoplePage from './components/feed/rightFeed/ExplorePeoplePage';
import ProtectedLayout from './ProtectedLayout';
import Chat from './pages/Chat';
import PremiumCard from './components/premium/PremiumCard.tsx';

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

  // Message handler: Adds the incoming message to the Redux store
  const handleReceiveMessage = useCallback((message: any) => {
    dispatch(addMessage({
      userId: message.senderId === currentUser?._id ? message.receiverId : message.senderId,
      message: message
    }));
  }, [dispatch, currentUser]);

  // Socket.IO connection and event listeners
  useEffect(() => {
    if (currentUser) {
      // Connect to the Socket.IO server with frontend by handshake
      socketRef.current = io(baseURL, {
        query: {
          userId: currentUser._id,
        },
        transports: ['websocket'],  // Use WebSocket for connection
        withCredentials: true       // Ensure CORS credentials are allowed
      });

      // Store the socket instance in Redux
      dispatch(setSocket(socketRef.current));

      // On socket connection
      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      // On socket disconnection
      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Listen for the list of online users
      socketRef.current.on('onlineUsers', (onlineUsers: string[]) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      
      // Listen for incoming messages
      socketRef.current.on('getMessage', handleReceiveMessage);
      
      // socketRef.current.on('typing', () => {
      //   // 
      // });

      // socketRef.current.on('stopTyping', () => {
      //   // 
      // });

      // Cleanup: disconnect socket and remove listeners on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.off('onlineUsers');
          socketRef.current.off('getMessage');
          socketRef.current.off('disconnect');
          // socketRef.current.off('typing');
          // socketRef.current.off('stopTyping');
          socketRef.current.disconnect();
        }
        dispatch(clearSocket());
      };
    }
  }, [currentUser, dispatch, handleReceiveMessage]);

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
        <Route path="/premium" element={<PremiumCard/>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
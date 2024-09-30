import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TOKEN_KEY = 'token';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!token;

  useEffect(() => {
    const publicRoutes = ['/', '/login', '/register'];
    const currentPath = location.pathname;

    if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
      navigate('/feed');
    } else if (!isAuthenticated && !publicRoutes.includes(currentPath)) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const login = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    navigate('/feed');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate('/');
  };

  return { isAuthenticated, login, logout };
};
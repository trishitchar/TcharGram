import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getToken = (): string | null => localStorage.getItem('token');

export const auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Redirect based on the current path and authentication state
    const handleRedirect = () => {
      const pathname = window.location.pathname;
      if (pathname === '/login' || pathname === '/register') {
        if (isAuthenticated) {
          navigate('/feed');
        }
      } else if (!isAuthenticated) {
        navigate('/login');
      }
    };

    handleRedirect();
  }, [navigate, isAuthenticated]);

  return { isAuthenticated };
};

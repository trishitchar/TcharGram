import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getCookie = (name:string): string|undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
    return undefined;
};

export const useAuthMiddleware = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie('token');
    // console.log(token);

    if (window.location.pathname === '/' && token) {
      navigate('/feed');
      return;
    } else if (!token && window.location.pathname !== '/') {
      navigate('/');
      return;
    }
  }, [navigate]);

  return {};
};
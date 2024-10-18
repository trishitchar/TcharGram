// // middleware/useAuthMiddleware.tsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Function to get the token from localStorage or cookies
// const getToken = (): string | null => {
//   return localStorage.getItem('token');
// };

// // Middleware-like hook to manage authentication redirects
// export const useAuthMiddleware = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true); // Add a loading state

//   useEffect(() => {
//     // Function to check authentication state and navigate accordingly
//     const checkAuth = () => {
//       const token = getToken();

//       if (token) {
//         if (window.location.pathname === '/login' || window.location.pathname === '/register') {
//           navigate('/feed', { replace: true });
//         }
//       } else {
//         if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
//           navigate('/login', { replace: true });
//         }
//       }

//       setIsLoading(false); // Set loading to false after checking
//     };

//     checkAuth();

//     window.addEventListener('storage', checkAuth);

//     return () => {
//       window.removeEventListener('storage', checkAuth);
//     };
//   }, [navigate]);

//   return { isLoading };
// };

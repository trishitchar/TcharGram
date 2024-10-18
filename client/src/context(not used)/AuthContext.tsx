// // context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Define the types for AuthContext
// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// }

// // Create the AuthContext
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Hook to use the AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // AuthProvider component managing authentication state
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
//   const navigate = useNavigate();

//   // Function to log in a user and set the token
//   const login = useCallback((token: string) => {
//     localStorage.setItem('token', token);
//     setIsAuthenticated(true);
//     navigate('/feed');
//   }, [navigate]);

//   // Function to log out a user and remove the token
//   const logout = useCallback(() => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     navigate('/login');
//   }, [navigate]);

//   // Effect to check authentication state on component mount and token changes
//   useEffect(() => {
//     const checkAuthState = () => {
//       const token = localStorage.getItem('token');
//       const authenticated = !!token;
//       setIsAuthenticated(authenticated);
//       if (!authenticated) {
//         navigate('/login'); // Redirect to login if not authenticated
//       }
//     };

//     // Event listener to detect manual changes in localStorage
//     window.addEventListener('storage', checkAuthState);
//     checkAuthState(); // Check authentication on component mount

//     return () => {
//       window.removeEventListener('storage', checkAuthState);
//     };
//   }, [navigate]);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

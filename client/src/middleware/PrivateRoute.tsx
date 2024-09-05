import React from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';
import { auth } from './auth';

interface PrivateRouteProps {
  element: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
  const { isAuthenticated } = auth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Route path={path} element={element} />;
};

export default PrivateRoute;

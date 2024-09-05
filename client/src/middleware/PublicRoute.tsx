import React from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';
import { auth } from './auth';

interface PublicRouteProps {
  element: JSX.Element;
  path: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element, path }) => {
  const { isAuthenticated } = auth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/feed" state={{ from: location }} replace />;
  }

  return <Route path={path} element={element} />;
};

export default PublicRoute;

// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  user: any;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

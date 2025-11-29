import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  role: string | null;
  requiredRole: string;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ role, requiredRole, children }: ProtectedRouteProps) => {
  if (role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

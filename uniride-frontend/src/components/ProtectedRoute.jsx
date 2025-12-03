import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  // roles = array of allowed roles e.g., ["student","driver"]

  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    // redirect if user role is not allowed
    return <Navigate to="/" replace />;
  }

  return children;
}

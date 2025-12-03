import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const goDashboard = () => {
    if (!user) return;
    if (user.role === 'student') navigate('/student/dashboard');
    else if (user.role === 'driver') navigate('/driver/dashboard');
    else if (user.role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <nav className="bg-white shadow p-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">UniRide</Link>
        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>

          {user?.role && (
            <button
              onClick={goDashboard}
              className="px-3 py-1 border rounded bg-blue-100"
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </button>
          )}

          {user ? (
            <>
              <span className="px-2">{user.name}</span>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/register" className="px-3 py-1 border rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

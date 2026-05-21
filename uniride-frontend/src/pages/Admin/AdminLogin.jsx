import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.user.role !== 'admin') {
        return alert('This account is not an admin');
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (login) {
        login(res.data.user, res.data.token);
      }

      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Admin login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin Login</h1>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Admin Email"
          className="w-full p-2 border"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
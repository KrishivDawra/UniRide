import React, { useState } from 'react';
import api from '../../api/axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.user.role !== 'admin') return alert('Not an admin');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/admin-dashboard';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="w-full p-2 border" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="w-full p-2 border" 
        />
        <button className="w-full bg-black text-white p-2">Login</button>
      </form>
    </div>
  );
}

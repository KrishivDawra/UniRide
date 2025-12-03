import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    mobile: ''
  });

  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect based on role
      if (res.data.user.role === 'student') navigate('/student');
      else if (res.data.user.role === 'driver') navigate('/driver');
      else navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.msg || 'Register failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="name" placeholder="Name" onChange={handle} className="w-full p-2 border" />
        <input name="email" placeholder="Email" onChange={handle} className="w-full p-2 border" />
        <input name="password" placeholder="Password" type="password" onChange={handle} className="w-full p-2 border" />
        <input name="mobile" placeholder="Mobile" onChange={handle} className="w-full p-2 border" />
        <select name="role" onChange={handle} className="w-full p-2 border">
          <option value="student">Student</option>
          <option value="driver">Driver</option>
        </select>
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Lock, Mail } from "lucide-react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data);

      const role = res.data.user.role;

      if (role === "student") navigate("/student/dashboard");
      else if (role === "driver") navigate("/driver/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border">
        <div className="hidden md:flex flex-col justify-between bg-blue-700 text-white p-10">
          <div>
            <div className="bg-white/20 w-fit p-4 rounded-2xl mb-6">
              <Car size={36} />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Welcome back to UniRide
            </h1>

            <p className="mt-4 text-blue-100">
              Login to manage rides, bookings, and your college travel dashboard.
            </p>
          </div>

          <p className="text-sm text-blue-100">
            Safe. Smart. Student-first ride sharing.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Login</h2>
          <p className="text-gray-500 mt-2">Enter your account details below.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative mt-2">
                <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to UniRide?{" "}
            <Link to="/register" className="text-blue-700 font-bold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Lock, Mail, Phone, UserRound } from "lucide-react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    mobile: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
  e.preventDefault();

  try {
      const res = await api.post("/auth/register", form);

      login(res.data);

      if (res.data.user.role === "student") {
        navigate("/student/dashboard");
      } else if (res.data.user.role === "driver") {
        navigate("/driver/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border">
        <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-10">
          <div>
            <div className="bg-white/10 w-fit p-4 rounded-2xl mb-6">
              <Car size={36} />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Join UniRide today
            </h1>

            <p className="mt-4 text-gray-300">
              Create your account as a student or driver and start using smart college ride sharing.
            </p>
          </div>

          <p className="text-sm text-gray-300">
            Built for safe campus mobility and efficient seat sharing.
          </p>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Register</h2>
          <p className="text-gray-500 mt-2">Create your UniRide account.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field icon={UserRound} name="name" value={form.name} onChange={handle} placeholder="Full Name" />
            <Field icon={Mail} name="email" value={form.email} onChange={handle} placeholder="Email Address" />
            <Field icon={Lock} name="password" type="password" value={form.password} onChange={handle} placeholder="Password" />
            <Field icon={Phone} name="mobile" value={form.mobile} onChange={handle} placeholder="Mobile Number" />

            <div>
              <label className="text-sm font-semibold text-gray-700">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handle}
                className="mt-2 w-full border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={18} className="absolute left-4 top-3.5 text-gray-400" />
      <input
        {...props}
        className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
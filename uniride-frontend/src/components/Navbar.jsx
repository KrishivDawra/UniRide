// ========================= NAVBAR.jsx =========================

import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Car,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Receipt,
  Shield,
  UserRound,
  LayoutDashboard,
  Home,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const dashboard = () => {
    if (user?.role === "student") navigate("/student/dashboard");
    else if (user?.role === "driver") navigate("/driver/dashboard");
    else if (user?.role === "admin") navigate("/admin/dashboard");
  };

  const links = [
    {
      to: "/",
      label: "Home",
      icon: Home,
      show: true,
    },

    {
      to: "/student/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: user?.role === "student",
    },

    {
      to: "/student/bookings",
      label: "Bookings",
      icon: Receipt,
      show: user?.role === "student",
    },

    {
      to: "/driver/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: user?.role === "driver",
    },

    {
      to: "/driver/create-ride",
      label: "Create Ride",
      icon: PlusCircle,
      show: user?.role === "driver",
    },

    {
      to: "/driver/my-rides",
      label: "My Rides",
      icon: Car,
      show: user?.role === "driver",
    },

    {
      to: "/admin/users",
      label: "Users",
      icon: UserRound,
      show: user?.role === "admin",
    },

    {
      to: "/admin/rides",
      label: "Rides",
      icon: Car,
      show: user?.role === "admin",
    },

    {
      to: "/admin/bookings",
      label: "Bookings",
      icon: Receipt,
      show: user?.role === "admin",
    },
  ].filter((l) => l.show);

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto h-16 px-6 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between shadow-lg shadow-cyan-500/10">

        {/* LEFT LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
        >
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
            <Car className="text-white" size={18} />
          </div>

          <h1 className="text-xl font-black tracking-tight text-white">
            Uni
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ride
            </span>
          </h1>
        </Link>

        {/* CENTER NAV */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;

            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive(l.to)
                    ? "bg-white text-slate-900"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {user ? (
            <>
              <button
                onClick={dashboard}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                {user.role === "admin" ? (
                  <Shield size={15} className="text-cyan-400" />
                ) : (
                  <UserRound size={15} className="text-cyan-400" />
                )}

                <span className="text-sm font-medium text-white">
                  {user.name}
                </span>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-full bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white transition"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* MOBILE MENU */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-200 hover:bg-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="lg:hidden mt-3 max-w-7xl mx-auto rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl p-4 flex flex-col gap-2">

          {links.map((l) => {
            const Icon = l.icon;

            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition ${
                  isActive(l.to)
                    ? "bg-white text-slate-900"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
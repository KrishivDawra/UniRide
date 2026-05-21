// ========================= HOME.jsx =========================

import React from "react";
import { Link } from "react-router-dom";

import {
  Car,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  Star,
  Leaf,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <CheckCircle size={15} />
            Verified Campus Ride Sharing
          </div>

          <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            Your Campus.
            <br />

            Your Ride.
            <br />

            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Your Community.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
            UniRide helps students share rides safely and affordably
            with verified drivers and trusted campus connections.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            <Link
              to="/register"
              className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Join UniRide

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition"
              />
            </Link>

            <Link
              to="/login"
              className="px-7 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all"
            >
              Login
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-12">

            <StatCard value="120+" label="Students" />
            <StatCard value="35+" label="Drivers" />
            <StatCard value="₹80" label="Avg Save" />

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative">

          <div className="absolute -top-5 -right-5 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle size={18} />
            </div>

            <div>
              <p className="font-bold text-white text-sm">
                Verified Ride
              </p>

              <p className="text-xs text-slate-400">
                Trusted & Secure
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-cyan-500/10">

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-3">

                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600">
                  <Car size={24} className="text-white" />
                </div>

                <div>
                  <h2 className="font-bold text-xl text-white">
                    Live Ride Preview
                  </h2>

                  <p className="text-sm text-slate-400">
                    Chitkara University Route
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold">
                <Star size={14} fill="currentColor" />
                4.9
              </div>
            </div>

            {/* ROUTE */}
            <div className="space-y-6 relative">

              <div className="absolute left-5 top-11 h-16 border-l border-dashed border-cyan-500/30" />

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 z-10">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="font-bold text-white">
                    Chitkara University
                  </p>

                  <p className="text-sm text-slate-400">
                    Pickup Point
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 z-10">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="font-bold text-white">
                    Sector 17, Chandigarh
                  </p>

                  <p className="text-sm text-slate-400">
                    Drop Location
                  </p>
                </div>
              </div>
            </div>

            {/* RIDE INFO */}
            <div className="grid grid-cols-3 gap-4 mt-8">

              <RideInfo
                icon={Clock}
                title="10:00 AM"
                sub="Time"
              />

              <RideInfo
                icon={Users}
                title="4 Seats"
                sub="Available"
              />

              <RideInfo
                icon={Car}
                title="Car"
                sub="Vehicle"
              />
            </div>

            <button className="w-full mt-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all">
              Book Ride
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="text-center max-w-2xl mx-auto mb-14">

          <h2 className="text-4xl font-black tracking-tight">
            Built for the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              student community
            </span>
          </h2>

          <p className="mt-4 text-slate-400">
            Safe, modern, and optimized for campus ride sharing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
            icon={<ShieldCheck />}
            title="Safe Travel"
            desc="Verified profiles and secure rides."
          />

          <FeatureCard
            icon={<Users />}
            title="Community"
            desc="Ride with students from your campus."
          />

          <FeatureCard
            icon={<Leaf />}
            title="Eco Friendly"
            desc="Reduce traffic and fuel costs together."
          />

          <FeatureCard
            icon={<Car />}
            title="Quick Booking"
            desc="Book rides instantly in seconds."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
      <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        {value}
      </p>

      <p className="text-sm text-slate-400 mt-1">
        {label}
      </p>
    </div>
  );
}

function RideInfo({ icon: Icon, title, sub }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
      <Icon className="mx-auto mb-2 text-cyan-400" size={20} />

      <p className="font-bold text-white">
        {title}
      </p>

      <p className="text-xs text-slate-400">
        {sub}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1">

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white mb-5">
        {React.cloneElement(icon, { size: 22 })}
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
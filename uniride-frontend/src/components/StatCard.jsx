import React from "react";

export default function StatCard({ title, value, icon: Icon, accent = "blue", change }) {
  const colors = {
    blue: { grad: "from-blue-600 to-violet-600", soft: "bg-blue-50 text-blue-600", glow: "shadow-blue-500/25" },
    orange: { grad: "from-orange-500 to-amber-500", soft: "bg-orange-50 text-orange-600", glow: "shadow-orange-500/25" },
    green: { grad: "from-emerald-500 to-teal-500", soft: "bg-emerald-50 text-emerald-600", glow: "shadow-emerald-500/25" },
    red: { grad: "from-red-500 to-rose-500", soft: "bg-red-50 text-red-600", glow: "shadow-red-500/25" },
    violet: { grad: "from-violet-600 to-fuchsia-600", soft: "bg-violet-50 text-violet-600", glow: "shadow-violet-500/25" },
  };
  const c = colors[accent] || colors.blue;

  return (
    <div className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all">
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${c.grad}`} />
      <div className={`absolute right-5 top-5 ${c.soft} p-3 rounded-2xl`}>
        {Icon && <Icon size={22} />}
      </div>

      <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
        {title}
      </p>

      <h2 className="text-4xl font-extrabold text-slate-900 mt-3">{value}</h2>

      {change && (
        <p className="text-emerald-600 text-sm font-semibold mt-3 flex items-center gap-1">
          ↑ {change}
        </p>
      )}
    </div>
  );
}

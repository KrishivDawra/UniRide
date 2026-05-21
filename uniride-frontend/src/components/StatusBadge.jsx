import React from "react";

export default function StatusBadge({ status }) {
  const styles = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    booked: "bg-emerald-50 text-emerald-700 border-emerald-200",
    full: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-violet-50 text-violet-700 border-violet-200",
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 capitalize whitespace-nowrap ${
        styles[status] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

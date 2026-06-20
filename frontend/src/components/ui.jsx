import React from "react";

export function Pill({ children, tone = "default" }) {
  const tones = {
    default: "bg-[#1B2A4A] text-[#E9D9A8] border-[#3a4a73]",
    gold: "bg-[#B8860B]/15 text-[#E9C46A] border-[#B8860B]/40",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    ghost: "bg-white/5 text-[#9AA7C7] border-white/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#101A33]/70 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ index, title, subtitle }) {
  return (
    <div className="mb-6 flex items-baseline gap-3 border-b border-white/10 pb-3">
      <span className="font-mono text-sm text-[#B8860B]">{index}</span>
      <div>
        <h2 className="font-serif text-xl text-[#F4EFE3] sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#9AA7C7]">{subtitle}</p>}
      </div>
    </div>
  );
}

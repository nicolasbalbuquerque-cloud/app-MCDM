// src/components/ui/Input.js
export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>}
      <input
        {...props}
        className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:outline-none focus:border-teal-500 text-slate-100 text-sm transition-colors w-full"
      />
    </div>
  );
}
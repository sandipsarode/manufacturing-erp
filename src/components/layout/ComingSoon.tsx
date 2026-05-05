import { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  stats?: { label: string; value: string }[];
}

export function ComingSoon({ title, description, icon: Icon, badge, stats }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-6">
      {/* Glow ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl scale-150" />
        <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-[#312e81] to-[#4c1d95] flex items-center justify-center shadow-2xl shadow-purple-900/30 ring-1 ring-white/10">
          <Icon className="h-12 w-12 text-white/80" />
        </div>
        {badge && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
            {badge}
          </span>
        )}
      </div>

      {/* Text */}
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">{title}</h1>
      <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-10">{description}</p>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
        Module under development · Coming soon
      </div>
    </div>
  );
}

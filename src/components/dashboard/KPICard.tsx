import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  iconBg?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, gradient, iconBg }: KPICardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-lg`}>
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
          <p className="text-white text-3xl font-bold leading-none">{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-2">{subtitle}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg || "bg-white/20"} backdrop-blur-sm flex-shrink-0`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Factory,
  Package,
  ShoppingCart,
  BarChart3,
  Wrench,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard",       href: "/dashboard",      icon: LayoutDashboard },
  { name: "User Management", href: "/users",           icon: Users },
  { name: "Manufacturing",   href: "/manufacturing",   icon: Factory },
  { name: "Inventory",       href: "/inventory",       icon: Package },
  { name: "Purchases",       href: "/purchases",       icon: ShoppingCart },
  { name: "Sales",           href: "/sales",           icon: BarChart3 },
  { name: "Maintenance",     href: "/maintenance",     icon: Wrench },
  { name: "Quality Control", href: "/quality",         icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#4c1d95] flex-shrink-0 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Factory className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Manufacturing</p>
          <p className="text-white/50 text-xs mt-0.5">ERP System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-lg shadow-black/10"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Profile section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-all cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">System Admin</p>
            <p className="text-white/40 text-xs truncate">admin@erp.com</p>
          </div>
          <LogOut className="h-3.5 w-3.5 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// Mobile bottom nav
export function MobileNav() {
  const pathname = usePathname();
  const mobileItems = [
    { name: "Dashboard",   href: "/dashboard",    icon: LayoutDashboard },
    { name: "Work Orders", href: "/manufacturing", icon: Factory },
    { name: "Inventory",   href: "/inventory",    icon: Package },
    { name: "Users",       href: "/users",        icon: Users },
    { name: "More",        href: "/quality",      icon: ShieldCheck },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] border-t border-white/10 px-2 py-2 flex items-center justify-around">
      {mobileItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
            <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/40"}`} />
            <span className={`text-[10px] font-medium ${isActive ? "text-white" : "text-white/40"}`}>{item.name}</span>
            {isActive && <div className="w-1 h-1 rounded-full bg-white" />}
          </Link>
        );
      })}
    </nav>
  );
}

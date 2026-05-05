"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Factory,
  Package,
  ShoppingCart,
  BarChart3,
  Calendar,
  ShieldCheck,
  Wrench,
  Database,
  LineChart,
  Settings,
  Users,
  Building,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

type ChildItem = { name: string; href: string };
type SubItem = { name: string; href?: string; children?: ChildItem[] };
type NavItem = {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: SubItem[];
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Operations",
    icon: Factory,
    subItems: [
      { name: "Manufacturing", href: "/manufacturing" },
      { name: "Inventory", href: "/inventory" },
      { name: "Sales", href: "/sales" },
      { name: "Purchases", href: "/purchases" },
    ],
  },
  {
    name: "Planning",
    icon: Calendar,
    subItems: [
      { name: "Production Planning", href: "/production-planning" },
      { name: "Shop Floor", href: "/shop-floor" },
    ],
  },
  {
    name: "Quality",
    icon: ShieldCheck,
    subItems: [{ name: "Quality Control", href: "/quality" }],
  },
  {
    name: "Maintenance",
    icon: Wrench,
    subItems: [{ name: "Maintenance", href: "/maintenance" }],
  },
  {
    name: "Master Data",
    icon: Database,
    subItems: [
      { name: "Products", href: "/products" },
      { name: "Bill of Materials", href: "/bom" },
      { name: "Work Centers", href: "/work-centers" },
    ],
  },
  {
    name: "Reports",
    icon: LineChart,
    subItems: [{ name: "Analytics", href: "/analytics" }],
  },
  {
    name: "Administration",
    icon: Settings,
    subItems: [
      { name: "User Management", href: "/users" },
      { name: "Roles & Permissions", href: "/roles" },
      { name: "Company Management", href: "/companies" },
      { name: "System Settings", href: "/settings" },
    ],
  },
];

function SidebarContent({ onMobileItemClick }: { onMobileItemClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    navigation.forEach((item) => {
      if (item.subItems) {
        const sectionMatch = item.subItems.some((sub) => {
          if (sub.href) return pathname.startsWith(sub.href);
          return false;
        });
        if (sectionMatch) setOpenSection(item.name);
      } else if (item.href && pathname.startsWith(item.href)) {
        setOpenSection(item.name);
      }
    });
  }, [pathname]);

  const toggleSection = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md overflow-hidden">
          <Image
            src="/si_logo.png"
            alt="SPEED Logo"
            width={40}
            height={40}
            className="object-contain p-1"
          />
        </div>
        <div>
          <p className="text-white font-black text-sm tracking-tight leading-none uppercase">SPEED</p>
          <p className="text-blue-400 font-bold text-[10px] mt-1 tracking-[0.2em] uppercase">Innovation</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        {navigation.map((item) => {
          const hasSubItems = !!item.subItems;
          const isOpen = openSection === item.name;
          const isActive = hasSubItems
            ? item.subItems!.some((sub) => sub.href && pathname.startsWith(sub.href))
            : item.href && pathname.startsWith(item.href);

          return (
            <div key={item.name} className="flex flex-col">
              {hasSubItems ? (
                <button
                  onClick={() => toggleSection(item.name)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none ${
                    isActive || isOpen
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-4 w-4 flex-shrink-0 transition-colors ${
                        isActive || isOpen ? "text-blue-400" : "text-white/50 group-hover:text-white/80"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isOpen ? "rotate-90 text-white" : "text-white/50"
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onMobileItemClick}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none ${
                    isActive
                      ? "bg-blue-600/20 text-white shadow-lg shadow-black/10 border border-blue-500/20"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 flex-shrink-0 transition-colors ${
                      isActive ? "text-blue-400" : "text-white/50 group-hover:text-white/80"
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                </Link>
              )}

              {/* Sub items */}
              {hasSubItems && (
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-1 mb-2" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-1 pl-10 pr-2">
                      {item.subItems!.map((sub) => {
                        const isSubActive = sub.href ? pathname.startsWith(sub.href) : false;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href!}
                            onClick={onMobileItemClick}
                            className={`relative flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none ${
                              isSubActive
                                ? "text-white bg-white/10"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {isSubActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r-full shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            )}
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile section */}
      <div className="px-3 py-4 border-t border-white/10 relative z-10">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-red-500/10 hover:text-red-400 text-white/70 transition-all cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 group-hover:opacity-80">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate group-hover:text-red-400 transition-colors">
              System Admin
            </p>
            <p className="text-white/40 text-[10px] truncate group-hover:text-red-400/70 transition-colors">
              admin@erp.com
            </p>
          </div>
          <LogOut className="h-4 w-4 text-white/40 group-hover:text-red-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#4c1d95] flex-shrink-0 relative overflow-hidden">
      <SidebarContent />
    </aside>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Menu Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-900/30 hover:scale-105 transition-transform"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#4c1d95] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl z-50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent onMobileItemClick={() => setIsOpen(false)} />
      </div>
    </>
  );
}

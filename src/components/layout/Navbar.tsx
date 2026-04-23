"use client";
import { Bell, Search, Settings } from "lucide-react";

export function Navbar() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {greeting}, Admin 👋
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-56">
          <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <input
            placeholder="Search anything..."
            className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="h-4 w-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Settings className="h-4 w-4 text-gray-500" />
        </button>

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer ring-2 ring-offset-1 ring-purple-200">
          AD
        </div>
      </div>
    </header>
  );
}

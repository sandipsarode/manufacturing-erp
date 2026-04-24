"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@erp.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-gray-100">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-3 shadow-lg shadow-indigo-100">
            <Image 
              src="/si_logo.png" 
              alt="SPEED Logo" 
              width={64} 
              height={64} 
              className="object-contain brightness-0 invert" 
            />
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-gray-900 uppercase">
            SPEED <span className="text-indigo-600">ERP</span>
          </h2>
          <p className="mt-3 text-center text-sm font-medium text-gray-500 uppercase tracking-widest">
            Innovation Management System
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="relative block w-full rounded-xl border-gray-100 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                placeholder="admin@erp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className="relative block w-full rounded-xl border-gray-100 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-xl py-6 font-bold text-lg shadow-lg shadow-indigo-100 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { KPICards } from "@/components/dashboard/KPICards";
import { DashboardCharts } from "@/components/dashboard/Charts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.ok ? r.json() : Promise.reject("Failed"))
      .then(setData)
      .catch(() => toast.error("Error loading dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <Skeleton className="h-64 rounded-2xl lg:col-span-4" />
          <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <KPICards data={data?.kpis} />

      {/* Charts */}
      <DashboardCharts data={data?.charts} />

      {/* Bottom: Recent Activity + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentActivity data={data?.recentActivity} />
        </div>
        <div className="xl:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

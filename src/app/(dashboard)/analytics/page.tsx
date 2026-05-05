import { ComingSoon } from "@/components/layout/ComingSoon";
import { LineChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <ComingSoon
      title="Analytics & Reports"
      description="Advanced dashboards, custom report builder, KPI tracking, and data exports across all ERP modules for business intelligence."
      icon={LineChart}
      badge="Soon"
      stats={[
        { label: "Reports", value: "—" },
        { label: "Dashboards", value: "—" },
        { label: "Data Sources", value: "—" },
      ]}
    />
  );
}

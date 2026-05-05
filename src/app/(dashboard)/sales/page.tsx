import { ComingSoon } from "@/components/layout/ComingSoon";
import { BarChart3 } from "lucide-react";

export default function SalesPage() {
  return (
    <ComingSoon
      title="Sales Management"
      description="Manage sales orders, customer quotes, pricing, and revenue tracking. Full sales lifecycle management coming soon."
      icon={BarChart3}
      badge="Soon"
      stats={[
        { label: "Orders Today", value: "—" },
        { label: "Revenue MTD", value: "—" },
        { label: "Open Quotes", value: "—" },
      ]}
    />
  );
}

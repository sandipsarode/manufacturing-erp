import { ComingSoon } from "@/components/layout/ComingSoon";
import { Calendar } from "lucide-react";

export default function ProductionPlanningPage() {
  return (
    <ComingSoon
      title="Production Planning"
      description="Schedule production runs, allocate resources, manage capacity, and optimize your manufacturing schedule with precision."
      icon={Calendar}
      badge="Soon"
      stats={[
        { label: "Planned Orders", value: "—" },
        { label: "Capacity Used", value: "—" },
        { label: "On-Time Rate", value: "—" },
      ]}
    />
  );
}

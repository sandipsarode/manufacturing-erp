import { ComingSoon } from "@/components/layout/ComingSoon";
import { Cpu } from "lucide-react";

export default function WorkCentersPage() {
  return (
    <ComingSoon
      title="Work Centers"
      description="Define and manage production work centers with capacity, shift calendars, cost rates, and routing configuration."
      icon={Cpu}
      badge="Soon"
      stats={[
        { label: "Work Centers", value: "—" },
        { label: "Active Shifts", value: "—" },
        { label: "Avg Utilization", value: "—" },
      ]}
    />
  );
}

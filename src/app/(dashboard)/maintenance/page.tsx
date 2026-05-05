import { ComingSoon } from "@/components/layout/ComingSoon";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <ComingSoon
      title="Maintenance Management"
      description="Preventive and corrective maintenance scheduling, asset tracking, breakdown analysis, and technician dispatch management."
      icon={Wrench}
      badge="Soon"
      stats={[
        { label: "Open Tickets", value: "—" },
        { label: "Assets", value: "—" },
        { label: "PM Compliance", value: "—" },
      ]}
    />
  );
}

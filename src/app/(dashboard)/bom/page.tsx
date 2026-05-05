import { ComingSoon } from "@/components/layout/ComingSoon";
import { GitBranch } from "lucide-react";

export default function BomPage() {
  return (
    <ComingSoon
      title="Bill of Materials"
      description="Multi-level BOM management with version control, where-used analysis, and component substitution for all manufactured products."
      icon={GitBranch}
      badge="Soon"
      stats={[
        { label: "Active BOMs", value: "—" },
        { label: "Components", value: "—" },
        { label: "BOM Levels", value: "—" },
      ]}
    />
  );
}

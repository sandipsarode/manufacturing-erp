import { ComingSoon } from "@/components/layout/ComingSoon";
import { ShieldCheck } from "lucide-react";

export default function QualityPage() {
  return (
    <ComingSoon
      title="Quality Control"
      description="Inspection management, non-conformance tracking, quality plans, and SPC charts to maintain product excellence."
      icon={ShieldCheck}
      badge="Soon"
      stats={[
        { label: "Inspections", value: "—" },
        { label: "NCRs Open", value: "—" },
        { label: "Pass Rate", value: "—" },
      ]}
    />
  );
}

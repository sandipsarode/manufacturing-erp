import { ComingSoon } from "@/components/layout/ComingSoon";
import { Factory } from "lucide-react";

export default function ShopFloorPage() {
  return (
    <ComingSoon
      title="Shop Floor Control"
      description="Real-time visibility into shop floor operations, work order execution, machine status, and operator tracking."
      icon={Factory}
      badge="Soon"
      stats={[
        { label: "Active WOs", value: "—" },
        { label: "Machines Live", value: "—" },
        { label: "OEE", value: "—" },
      ]}
    />
  );
}

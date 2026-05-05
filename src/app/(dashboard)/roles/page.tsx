import { ComingSoon } from "@/components/layout/ComingSoon";
import { ShieldCheck } from "lucide-react";

export default function RolesPage() {
  return (
    <ComingSoon
      title="Roles & Permissions"
      description="Define granular role-based access control, permission sets, and module visibility to secure your ERP data."
      icon={ShieldCheck}
      badge="Soon"
      stats={[
        { label: "Roles", value: "—" },
        { label: "Permissions", value: "—" },
        { label: "Users Assigned", value: "—" },
      ]}
    />
  );
}

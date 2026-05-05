import { ComingSoon } from "@/components/layout/ComingSoon";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="System Settings"
      description="Configure application-wide settings including email, integrations, number formats, fiscal year, and notification preferences."
      icon={Settings}
      badge="Soon"
      stats={[
        { label: "Integrations", value: "—" },
        { label: "Config Keys", value: "—" },
        { label: "Last Updated", value: "—" },
      ]}
    />
  );
}

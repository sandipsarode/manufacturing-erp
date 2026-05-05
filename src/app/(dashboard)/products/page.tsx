import { ComingSoon } from "@/components/layout/ComingSoon";
import { Package } from "lucide-react";

export default function ProductsPage() {
  return (
    <ComingSoon
      title="Product Master"
      description="Centralized product catalog with specifications, UoM, costing, and classification for all manufactured and purchased items."
      icon={Package}
      badge="Soon"
      stats={[
        { label: "Active Items", value: "—" },
        { label: "Categories", value: "—" },
        { label: "Low Stock", value: "—" },
      ]}
    />
  );
}

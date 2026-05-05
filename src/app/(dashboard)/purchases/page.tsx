import { ComingSoon } from "@/components/layout/ComingSoon";
import { ShoppingCart } from "lucide-react";

export default function PurchasesPage() {
  return (
    <ComingSoon
      title="Purchase Management"
      description="Handle purchase orders, vendor management, goods receipts, and procurement workflows in one place."
      icon={ShoppingCart}
      badge="Soon"
      stats={[
        { label: "POs Open", value: "—" },
        { label: "Pending GRN", value: "—" },
        { label: "Vendors", value: "—" },
      ]}
    />
  );
}

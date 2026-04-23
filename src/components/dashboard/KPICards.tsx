import { Package, PlayCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { KPICard } from "./KPICard";

export function KPICards({ data }: { data: any }) {
  if (!data) return null;

  const cards = [
    {
      title: "Total Products",
      value: data.totalProducts,
      subtitle: "Across all categories",
      icon: Package,
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-600",
    },
    {
      title: "Active Work Orders",
      value: data.activeWorkOrders,
      subtitle: "Currently in production",
      icon: PlayCircle,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-700",
    },
    {
      title: "Completed Today",
      value: data.completedToday,
      subtitle: "Work orders finished",
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      title: "Low Stock Items",
      value: data.lowStockItems,
      subtitle: data.lowStockItems > 0 ? "Requires immediate attention" : "All stocked well",
      icon: AlertTriangle,
      gradient: data.lowStockItems > 0
        ? "bg-gradient-to-br from-red-500 to-rose-600"
        : "bg-gradient-to-br from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}

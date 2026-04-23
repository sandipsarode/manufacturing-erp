import { AlertTriangle, AlertCircle, X } from "lucide-react";

const MOCK_ALERTS = [
  { id: 1, level: "critical", message: "Low stock: Copper Wire — only 3 units left (min: 20)" },
  { id: 2, level: "critical", message: "Low stock: Bearing Assembly — only 5 units left (min: 25)" },
  { id: 3, level: "warning",  message: "2 Work Orders are In Progress without assigned operators" },
];

export function AlertsPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Critical Alerts</h3>
        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {MOCK_ALERTS.filter(a => a.level === "critical").length} Critical
        </span>
      </div>
      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {MOCK_ALERTS.map((alert) => (
          <div key={alert.id} className={`flex items-start gap-3 px-5 py-3 ${alert.level === "critical" ? "bg-red-50/50" : "bg-amber-50/50"}`}>
            {alert.level === "critical"
              ? <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              : <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />}
            <p className={`text-xs leading-relaxed flex-1 ${alert.level === "critical" ? "text-red-700" : "text-amber-700"}`}>
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

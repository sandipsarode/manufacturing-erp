import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export function RecentActivity({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Stock Movements */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Recent Stock Movements</h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest inventory changes</p>
        </div>
        <div className="divide-y divide-gray-50">
          {data.movements.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No movements yet.</p>
          )}
          {data.movements.map((m: any) => (
            <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 ${m.type === "IN" ? "bg-emerald-50" : "bg-red-50"}`}>
                {m.type === "IN"
                  ? <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                  : <ArrowUpRight className="h-4 w-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{m.product?.name}</p>
                <p className="text-xs text-gray-400 truncate">{m.reference || "Manual adjustment"}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${m.type === "IN" ? "text-emerald-600" : "text-red-500"}`}>
                  {m.type === "IN" ? "+" : "-"}{m.quantity}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(m.createdAt), "MMM d, HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Work Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Recent Work Orders</h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest production tasks</p>
        </div>
        <div className="divide-y divide-gray-50">
          {data.workOrders.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No work orders yet.</p>
          )}
          {data.workOrders.map((wo: any) => {
            const progress = wo.producedQty > 0 ? Math.round((wo.producedQty / wo.plannedQty) * 100) : (wo.status === "COMPLETED" ? 100 : wo.status === "IN_PROGRESS" ? 50 : 0);
            return (
              <div key={wo.id} className="px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs font-mono font-medium text-gray-600">WO-{wo.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <StatusBadge status={wo.status} />
                </div>
                <p className="text-xs font-medium text-gray-800 mb-2">{wo.finishedGood?.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${wo.status === "COMPLETED" ? "bg-emerald-500" : "bg-indigo-500"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

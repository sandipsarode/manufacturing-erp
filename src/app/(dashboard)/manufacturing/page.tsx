"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Plus, ListTodo, Factory, Clock, CheckCircle2, FileText } from "lucide-react";
import { CreateBOMDialog } from "@/components/manufacturing/CreateBOMDialog";
import { CreateWorkOrderDialog } from "@/components/manufacturing/CreateWorkOrderDialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export default function ManufacturingPage() {
  const [boms, setBoms] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBOMOpen, setIsBOMOpen] = useState(false);
  const [isWOOpen, setIsWOOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bomRes, woRes] = await Promise.all([fetch('/api/bom'), fetch('/api/work-orders')]);
      if (bomRes.ok) setBoms(await bomRes.json());
      if (woRes.ok) setWorkOrders(await woRes.json());
    } catch { toast.error("Failed to fetch data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateWorkOrder = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/work-orders/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Work order moved to ${status.replace("_", " ")}`);
      fetchData();
    } catch (err: any) { toast.error(err.message); }
  };

  const columns = [
    { key: "DRAFT",       label: "Draft",       icon: FileText,     color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
    { key: "IN_PROGRESS", label: "In Progress", icon: Clock,        color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200" },
    { key: "COMPLETED",   label: "Completed",   icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manufacturing</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage BOMs and production work orders</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => setIsBOMOpen(true)} className="rounded-xl border-gray-200">
            <Plus className="mr-2 h-4 w-4" /> Create BOM
          </Button>
          <Button onClick={() => setIsWOOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md shadow-indigo-200">
            <ListTodo className="mr-2 h-4 w-4" /> New Work Order
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.key} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3`}>
            <div className={`${col.bg} ${col.color} h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <col.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(workOrders as any[]).filter((wo: any) => wo.status === col.key).length}
              </p>
              <p className="text-xs text-gray-500">{col.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`px-4 py-3 border-b ${col.border} ${col.bg} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <col.icon className={`h-4 w-4 ${col.color}`} />
                <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {(workOrders as any[]).filter((wo: any) => wo.status === col.key).length}
              </Badge>
            </div>
            <div className="p-3 space-y-3 min-h-[400px]">
              {(workOrders as any[]).filter((wo: any) => wo.status === col.key).map((wo: any) => (
                <div key={wo.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 hover:shadow-sm transition-all hover:border-indigo-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-gray-500">WO-{wo.id.slice(-6).toUpperCase()}</span>
                    <StatusBadge status={wo.status} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{wo.finishedGood?.name}</p>
                  <p className="text-xs text-gray-400 mb-3">Planned: <span className="font-medium text-gray-600">{wo.plannedQty} units</span></p>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{wo.status === 'COMPLETED' ? '100' : wo.status === 'IN_PROGRESS' ? '50' : '0'}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full">
                      <div className={`h-1.5 rounded-full ${col.key === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${wo.status === 'COMPLETED' ? 100 : wo.status === 'IN_PROGRESS' ? 50 : 0}%` }} />
                    </div>
                  </div>

                  {wo.status !== 'COMPLETED' && (
                    <Button size="sm" variant={wo.status === 'IN_PROGRESS' ? 'default' : 'outline'}
                      className={`w-full text-xs rounded-lg h-7 ${wo.status === 'IN_PROGRESS' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                      onClick={() => updateWorkOrder(wo.id, wo.status === 'DRAFT' ? 'IN_PROGRESS' : 'COMPLETED')}>
                      {wo.status === 'DRAFT' ? 'Start Production' : 'Complete Order'}
                    </Button>
                  )}
                </div>
              ))}
              {(workOrders as any[]).filter((wo: any) => wo.status === col.key).length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Factory className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-xs">No work orders</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateBOMDialog open={isBOMOpen} onOpenChange={setIsBOMOpen} onSuccess={fetchData} />
      <CreateWorkOrderDialog open={isWOOpen} onOpenChange={setIsWOOpen} boms={boms} onSuccess={fetchData} />
      <Toaster position="top-right" />
    </div>
  );
}

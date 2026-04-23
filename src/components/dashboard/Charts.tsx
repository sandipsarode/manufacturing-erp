"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { ChartCard } from "./ChartCard";

const DONUT_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
        <p className="font-semibold">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-white/80">{p.name}: <span className="text-white font-medium">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardCharts({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {/* Production Trend - Wide */}
      <div className="lg:col-span-4">
        <ChartCard title="Production Efficiency" subtitle="Units completed per day (last 7 days)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.productionTrend} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="completed" stroke="#6366f1"
                strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Work Order Status Donut */}
      <div className="lg:col-span-3">
        <ChartCard title="Work Order Status" subtitle="Current distribution">
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={data.workOrderStatus} cx="50%" cy="50%" innerRadius={52} outerRadius={72}
                  paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {data.workOrderStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 pb-2">
              {data.workOrderStatus.map((entry: any, i: number) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="text-xs text-gray-500">{entry.name}</span>
                  <span className="text-xs font-semibold text-gray-700">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Inventory Usage Bar — full width */}
      {data.inventoryUsage.length > 0 && (
        <div className="lg:col-span-7">
          <ChartCard title="Inventory Usage" subtitle="Top consumed raw materials (OUT movements)">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.inventoryUsage} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantity" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Qty Used" maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

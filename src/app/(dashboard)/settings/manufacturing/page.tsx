"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Factory,
  ScanBarcode,
  Package,
  CalendarClock,
  BadgeDollarSign,
  Info,
  Save,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

interface NumberFieldProps {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}

// ─── Reusable Components ─────────────────────────────────────────────────────
function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50/80 to-white">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#312e81] to-[#4c1d95] flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="flex-shrink-0 data-checked:bg-indigo-600"
      />
    </div>
  );
}

function NumberField({ label, hint, value, onChange, unit = "days" }: NumberFieldProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4 hover:bg-gray-50/60 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{hint}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 h-9 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
        <span className="text-xs text-gray-400 font-medium w-8">{unit}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ManufacturingSettingsPage() {
  // Section 1: Operations
  const [workOrders, setWorkOrders] = useState(true);
  const [routings, setRoutings] = useState(true);
  const [unlockQty, setUnlockQty] = useState(false);
  const [eWorkInstructions, setEWorkInstructions] = useState(false);

  // Section 2: Traceability
  const [lotSerial, setLotSerial] = useState(true);
  const [expirationDates, setExpirationDates] = useState(false);

  // Section 3: Products
  const [byProducts, setByProducts] = useState(false);
  const [subcontracting, setSubcontracting] = useState(false);

  // Section 4: MRP Buffers
  const [daysToPurchase, setDaysToPurchase] = useState(7);
  const [daysToManufacture, setDaysToManufacture] = useState(3);
  const [securityLeadTime, setSecurityLeadTime] = useState(1);

  // Section 5: Costing
  const [costingMethod, setCostingMethod] = useState("standard");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Administration › System Settings
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manufacturing Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure manufacturing features, MRP buffers, and costing methods
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
            saved
              ? "bg-green-500 text-white shadow-green-200"
              : "bg-gradient-to-r from-[#312e81] to-[#4c1d95] text-white shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02]"
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* ── Section 1: Operations ── */}
      <SectionCard icon={Factory} title="Operations">
        <ToggleRow
          title="Work Orders"
          description="Enable work order management for production tracking and operator assignments."
          checked={workOrders}
          onChange={setWorkOrders}
        />
        <ToggleRow
          title="Routings"
          description="Define step-by-step manufacturing operations linked to work centers."
          checked={routings}
          onChange={setRoutings}
        />
        <ToggleRow
          title="Unlocking Quantity on Confirmed MO"
          description="Allow editing of component quantities after a manufacturing order is confirmed."
          checked={unlockQty}
          onChange={setUnlockQty}
        />
        <ToggleRow
          title="Electronic Work Instructions"
          description="Attach digital instructions, PDFs, or links directly to work order operations."
          checked={eWorkInstructions}
          onChange={setEWorkInstructions}
        />
      </SectionCard>

      {/* ── Section 2: Traceability ── */}
      <SectionCard icon={ScanBarcode} title="Traceability">
        <ToggleRow
          title="Lot / Serial Number Tracking"
          description="Track individual units or batches throughout the manufacturing and inventory lifecycle."
          checked={lotSerial}
          onChange={setLotSerial}
        />
        <ToggleRow
          title="Expiration Dates on Lots"
          description="Record and enforce expiry dates on lot-tracked items during production and delivery."
          checked={expirationDates}
          onChange={setExpirationDates}
        />
      </SectionCard>

      {/* ── Section 3: Products ── */}
      <SectionCard icon={Package} title="Products">
        <ToggleRow
          title="By-Products"
          description="Track secondary outputs from manufacturing operations alongside finished goods."
          checked={byProducts}
          onChange={setByProducts}
        />
        <ToggleRow
          title="Subcontracting"
          description="Send components to external vendors for processing and receive finished goods back."
          checked={subcontracting}
          onChange={setSubcontracting}
        />
      </SectionCard>

      {/* ── Section 4: MRP Planning Buffers ── */}
      <SectionCard icon={CalendarClock} title="MRP Planning Buffers">
        <NumberField
          label="Days to Purchase"
          hint="Extra lead time buffer added to purchase orders during MRP scheduling."
          value={daysToPurchase}
          onChange={setDaysToPurchase}
        />
        <NumberField
          label="Days to Manufacture"
          hint="Additional buffer days added to manufacturing order start dates in MRP."
          value={daysToManufacture}
          onChange={setDaysToManufacture}
        />
        <NumberField
          label="Security Lead Time"
          hint="Safety buffer to account for late deliveries and ensure on-time stock availability."
          value={securityLeadTime}
          onChange={setSecurityLeadTime}
        />
      </SectionCard>

      {/* ── Section 5: Costing Method ── */}
      <SectionCard icon={BadgeDollarSign} title="Costing Method">
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">Costing Method</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Determines how product cost is calculated across the system.
              </p>
            </div>
            <Select value={costingMethod} onValueChange={(val) => val && setCostingMethod(val)}>
              <SelectTrigger className="w-52 h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Price</SelectItem>
                <SelectItem value="avco">Average Cost (AVCO)</SelectItem>
                <SelectItem value="fifo">First In First Out (FIFO)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
            <Info className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              <span className="font-bold">Note:</span> The costing method is configured per product
              category. Changing this setting affects all categories currently using the default
              method. Existing inventory valuation will be recalculated automatically.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

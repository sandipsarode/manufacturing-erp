"use client";

import { useState } from "react";
import { 
  Settings, 
  Factory, 
  Mail, 
  Shield, 
  Puzzle, 
  Save, 
  Plus, 
  Info, 
  ChevronRight,
  Server,
  Key,
  ArrowLeft,
  Zap,
  Loader2,
  Trash2,
  ScanBarcode,
  Package,
  CalendarClock,
  BadgeDollarSign
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────
type TabType = "general" | "manufacturing" | "email" | "security" | "integrations";

// ─── Reusable Components ─────────────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/30">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="flex-shrink-0" />
    </div>
  );
}

function NumberField({ label, hint, value, onChange, unit = "days" }: { label: string; hint: string; value: number; onChange: (v: number) => void; unit?: string }) {
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
          className="w-20 h-9 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
        <span className="text-xs text-gray-400 font-medium w-8">{unit}</span>
      </div>
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start py-4">
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // --- Manufacturing State ---
  const [mfgSettings, setMfgSettings] = useState({
    workOrders: true,
    routings: true,
    unlockQty: false,
    eWorkInstructions: false,
    lotSerial: true,
    expirationDates: false,
    byProducts: false,
    subcontracting: false,
    daysToPurchase: 7,
    daysToManufacture: 3,
    securityLeadTime: 1,
    costingMethod: "standard"
  });

  // --- Email State ---
  const [emailView, setEmailView] = useState<"list" | "form">("list");
  const [emailServers, setEmailServers] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult("success");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>Administration</span>
            <ChevronRight className="h-3 w-3" />
            <span>System Settings</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organization's core configurations and module behavior.</p>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
            saved
              ? "bg-green-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]"
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-2xl w-fit">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "manufacturing", label: "Manufacturing", icon: Factory },
          { id: "email", label: "Email / SMTP", icon: Mail },
          { id: "security", label: "Security", icon: Shield },
          { id: "integrations", label: "Integrations", icon: Puzzle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-indigo-600" : "text-gray-400"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="mt-2">
        {/* TAB: GENERAL */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionCard icon={Settings} title="General Configuration">
              <div className="p-6 space-y-6">
                <FormField label="Organization Name" hint="Display name for reports and invoices.">
                  <input type="text" defaultValue="Speed Innovation Ltd." className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </FormField>
                <FormField label="Default Currency" hint="Used for costing and sales orders.">
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-full h-11 text-sm bg-gray-50/50 border-gray-100 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </SectionCard>
          </div>
        )}

        {/* TAB: MANUFACTURING */}
        {activeTab === "manufacturing" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SectionCard icon={Factory} title="Operations">
              <ToggleRow title="Work Orders" description="Enable production tracking and operator assignments." checked={mfgSettings.workOrders} onChange={(v) => setMfgSettings({...mfgSettings, workOrders: v})} />
              <ToggleRow title="Routings" description="Define step-by-step operations linked to work centers." checked={mfgSettings.routings} onChange={(v) => setMfgSettings({...mfgSettings, routings: v})} />
              <ToggleRow title="Unlocking Quantity" description="Allow editing component quantities on confirmed MOs." checked={mfgSettings.unlockQty} onChange={(v) => setMfgSettings({...mfgSettings, unlockQty: v})} />
              <ToggleRow title="Digital Instructions" description="Attach PDFs or links directly to operations." checked={mfgSettings.eWorkInstructions} onChange={(v) => setMfgSettings({...mfgSettings, eWorkInstructions: v})} />
            </SectionCard>
            
            <SectionCard icon={ScanBarcode} title="Traceability">
              <ToggleRow title="Lot / Serial Tracking" description="Track units or batches throughout the lifecycle." checked={mfgSettings.lotSerial} onChange={(v) => setMfgSettings({...mfgSettings, lotSerial: v})} />
              <ToggleRow title="Expiration Dates" description="Enforce expiry dates on lot-tracked items." checked={mfgSettings.expirationDates} onChange={(v) => setMfgSettings({...mfgSettings, expirationDates: v})} />
            </SectionCard>

            <SectionCard icon={CalendarClock} title="MRP Planning Buffers">
              <NumberField label="Days to Purchase" hint="Lead time buffer for purchase orders." value={mfgSettings.daysToPurchase} onChange={(v) => setMfgSettings({...mfgSettings, daysToPurchase: v})} />
              <NumberField label="Days to Manufacture" hint="Buffer for manufacturing order start dates." value={mfgSettings.daysToManufacture} onChange={(v) => setMfgSettings({...mfgSettings, daysToManufacture: v})} />
              <NumberField label="Security Lead Time" hint="Safety buffer for late deliveries." value={mfgSettings.securityLeadTime} onChange={(v) => setMfgSettings({...mfgSettings, securityLeadTime: v})} />
            </SectionCard>
            
            <SectionCard icon={BadgeDollarSign} title="Costing Method">
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Valuation Strategy</p>
                    <p className="text-xs text-gray-400 mt-0.5">Global default costing method for new product categories.</p>
                  </div>
                  <Select value={mfgSettings.costingMethod} onValueChange={(v) => v && setMfgSettings({...mfgSettings, costingMethod: v})}>
                    <SelectTrigger className="w-52 h-10 text-sm border-gray-100 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Price</SelectItem>
                      <SelectItem value="avco">Average Cost (AVCO)</SelectItem>
                      <SelectItem value="fifo">FIFO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* TAB: EMAIL */}
        {activeTab === "email" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {emailView === "list" ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Outgoing Mail Servers</h3>
                    <p className="text-xs text-gray-500">Configure SMTP gateways for system notifications.</p>
                  </div>
                  <button 
                    onClick={() => setEmailView("form")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    New Server
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="h-20 w-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">No Servers Configured</h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto mb-8">Set up your first SMTP server to start sending purchase orders and notifications.</p>
                  <button 
                    onClick={() => setEmailView("form")}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-2"
                  >
                    Configure your first server
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setEmailView("list")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Servers
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTestConnection}
                      disabled={testing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        testResult === "success" 
                          ? "bg-green-50 border-green-200 text-green-700" 
                          : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                      }`}
                    >
                      {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                      {testResult === "success" ? "Verified" : testing ? "Testing..." : "Test Connection"}
                    </button>
                    <button onClick={() => setEmailView("list")} className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700">Save Server</button>
                  </div>
                </div>

                <SectionCard icon={Server} title="Server Configuration">
                  <div className="p-6 space-y-4">
                    <FormField label="Server Host" hint="SMTP hostname (e.g., smtp.gmail.com)">
                      <input type="text" placeholder="smtp.example.com" className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl outline-none" />
                    </FormField>
                    <div className="grid grid-cols-2 gap-6">
                      <FormField label="Port">
                        <input type="text" placeholder="587" className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl outline-none" />
                      </FormField>
                      <FormField label="Encryption">
                        <Select defaultValue="starttls">
                          <SelectTrigger className="w-full h-11 text-sm bg-gray-50/50 border-gray-100 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="starttls">STARTTLS</SelectItem>
                            <SelectItem value="ssl">SSL/TLS</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard icon={Key} title="Authentication">
                  <div className="p-6 space-y-4">
                    <FormField label="Username" hint="Usually your full email address.">
                      <input type="text" placeholder="user@company.com" className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl outline-none" />
                    </FormField>
                    <FormField label="Password" hint="App-specific password is recommended.">
                      <input type="password" placeholder="••••••••••••" className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl outline-none" />
                    </FormField>
                  </div>
                </SectionCard>
              </div>
            )}
          </div>
        )}

        {/* TAB: SECURITY/INTEGRATIONS */}
        {(activeTab === "security" || activeTab === "integrations") && (
          <div className="bg-white rounded-3xl border border-gray-100 border-dashed p-20 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Puzzle className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">Coming Soon</h3>
            <p className="text-sm text-gray-400 mt-2">We are currently building advanced {activeTab} modules.</p>
          </div>
        )}
      </div>
    </div>
  );
}

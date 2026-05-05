"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Zap, 
  Server, 
  Shield, 
  Mail, 
  Key,
  Info,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Reusable Section Card ───────────────────────────────────────────────────
function ConfigSection({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: any; 
  title: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/30">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#312e81] to-[#4c1d95] flex items-center justify-center">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-6 space-y-5">
        {children}
      </div>
    </div>
  );
}

// ─── Input Wrapper ───────────────────────────────────────────────────────────
function FormField({ 
  label, 
  hint, 
  children 
}: { 
  label: string; 
  hint?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
      </div>
      <div className="md:col-span-2">
        {children}
      </div>
    </div>
  );
}

export default function NewSMTPPage() {
  const router = useRouter();
  
  // State
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("587");
  const [encryption, setEncryption] = useState("starttls");
  const [fromEmail, setFromEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    // Mock test
    setTimeout(() => {
      setTesting(false);
      setTestResult("success");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/settings/email"
            className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">New Mail Server</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Configure SMTP Credentials</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              testResult === "success" 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {testResult === "success" ? "Connection Verified" : testing ? "Testing..." : "Test Connection"}
          </button>
          
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#312e81] to-[#4c1d95] text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-95">
            <Save className="h-4 w-4" />
            Save Server
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Section: Server Configuration */}
        <ConfigSection icon={Server} title="Server Configuration">
          <FormField 
            label="Name" 
            hint="A friendly name for this server (e.g., Office365, Gmail)."
          >
            <input 
              type="text" 
              placeholder="Primary SMTP Server"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>

          <FormField 
            label="SMTP Host" 
            hint="The hostname of your SMTP server."
          >
            <input 
              type="text" 
              placeholder="smtp.example.com"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              label="SMTP Port" 
              hint="Common ports: 587 (TLS), 465 (SSL)."
            >
              <input 
                type="text" 
                placeholder="587"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
            </FormField>

            <FormField label="Encryption">
              <Select value={encryption} onValueChange={(val: any) => setEncryption(val)}>
                <SelectTrigger className="w-full h-11 text-sm bg-gray-50/50 border-gray-100 rounded-xl">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="starttls">STARTTLS (Recommended)</SelectItem>
                  <SelectItem value="ssl">SSL/TLS</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </ConfigSection>

        {/* Section: Email Settings */}
        <ConfigSection icon={Mail} title="Email Settings">
          <FormField 
            label="From Email" 
            hint="The email address that will appear in the 'From' field."
          >
            <input 
              type="email" 
              placeholder="notifications@yourcompany.com"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>
        </ConfigSection>

        {/* Section: Authentication */}
        <ConfigSection icon={Key} title="Authentication">
          <FormField 
            label="Username / Login" 
            hint="Usually your full email address."
          >
            <input 
              type="text" 
              placeholder="user@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>

          <FormField 
            label="Password" 
            hint="The password or app-specific password."
          >
            <input 
              type="password" 
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>
        </ConfigSection>

        {/* Info Box */}
        <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-900">Configuring for Gmail/O365?</p>
            <p className="text-xs text-blue-700/80 leading-relaxed">
              For security, we recommend using an <strong>App Password</strong> instead of your primary account password. 
              Ensure that SMTP is enabled in your provider's admin console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

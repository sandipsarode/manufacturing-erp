"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
  Trash2
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

export default function EditSMTPPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  // State
  const [name, setName] = useState("Default SMTP");
  const [host, setHost] = useState("smtp.office365.com");
  const [port, setPort] = useState("587");
  const [encryption, setEncryption] = useState("starttls");
  const [fromEmail, setFromEmail] = useState("erp@company.com");
  const [username, setUsername] = useState("erp@company.com");
  const [password, setPassword] = useState("••••••••••••");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult("success");
    }, 1500);
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
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Edit Server</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Server ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 w-11 flex items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all">
            <Trash2 className="h-5 w-5" />
          </button>

          <button
            onClick={handleTestConnection}
            disabled={testing}
            className={`flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold transition-all border ${
              testResult === "success" 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {testResult === "success" ? "Verified" : testing ? "Testing..." : "Test"}
          </button>
          
          <button className="flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-[#312e81] to-[#4c1d95] text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-95">
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 gap-6">
        <ConfigSection icon={Server} title="Server Configuration">
          <FormField label="Name">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>

          <FormField label="SMTP Host">
            <input 
              type="text" 
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="SMTP Port">
              <input 
                type="text" 
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
                  <SelectItem value="starttls">STARTTLS</SelectItem>
                  <SelectItem value="ssl">SSL/TLS</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </ConfigSection>

        <ConfigSection icon={Mail} title="Email Settings">
          <FormField label="From Email">
            <input 
              type="email" 
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>
        </ConfigSection>

        <ConfigSection icon={Key} title="Authentication">
          <FormField label="Username">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>

          <FormField label="Password">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            />
          </FormField>
        </ConfigSection>
      </div>
    </div>
  );
}

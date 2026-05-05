"use client";

import Link from "next/link";
import { 
  Plus, 
  Mail, 
  Server, 
  ShieldCheck, 
  ExternalLink,
  Info,
  ChevronRight,
  MoreVertical
} from "lucide-react";

export default function SMTPListPage() {
  // Empty state for now
  const servers: any[] = [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Administration › System Settings
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Outgoing Mail Servers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure SMTP servers to enable the system to send automated emails and notifications.
          </p>
        </div>

        <Link
          href="/settings/email/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#312e81] to-[#4c1d95] text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Server
        </Link>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Info className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-indigo-900">Email System Configuration</p>
          <p className="text-xs text-indigo-700/80 leading-relaxed max-w-3xl">
            Outgoing mail servers are used to send emails from the ERP system (e.g., purchase orders to vendors, invoices to customers). 
            You can configure multiple servers and set priority rules. Ensure your firewall allows outgoing traffic on the configured SMTP ports.
          </p>
        </div>
      </div>

      {/* Server List Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="h-20 w-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
              <Mail className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Mail Servers Configured</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-8">
              You haven't added any outgoing mail servers yet. Add one to start sending system notifications.
            </p>
            <Link
              href="/settings/email/new"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors"
            >
              Configure your first server
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
             {/* Table placeholder for future scalability */}
          </div>
        )}
      </div>

      {/* Quick Links / Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 group cursor-pointer hover:border-indigo-200 transition-all">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Security Best Practices</p>
            <p className="text-xs text-gray-400 mt-0.5">Learn how to secure your SMTP credentials.</p>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-300 ml-auto" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 group cursor-pointer hover:border-indigo-200 transition-all">
          <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
            <Server className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Port Configuration Guide</p>
            <p className="text-xs text-gray-400 mt-0.5">Recommended ports for SSL/TLS and STARTTLS.</p>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-300 ml-auto" />
        </div>
      </div>
    </div>
  );
}

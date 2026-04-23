"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  User, Mail, Lock, ShieldCheck, Building, 
  Globe, Clock, Briefcase, ArrowLeft, KeyRound,
  CheckCircle2, XCircle
} from "lucide-react";

const MODULES = [
  "Manufacturing", "Inventory", "Accounting", "Purchase", 
  "Sales", "Maintenance", "HR", "Quality"
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Chinese"];
const TIMEZONES = ["UTC", "EST", "PST", "GMT", "IST", "AEST"];

export function UserFormDialog({ open, onOpenChange, user, onSuccess, roles, companies }: any) {
  const isEditing = !!user;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    companyId: "none",
    active: true,
    language: "English",
    timezone: "UTC",
    modules: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        roleId: user.roleId || "",
        companyId: user.companyId || "none",
        active: user.active ?? true,
        language: user.language || "English",
        timezone: user.timezone || "UTC",
        modules: user.permissions?.map((p: any) => p.permission.module) || [],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        roleId: roles?.[0]?.id || "",
        companyId: "none",
        active: true,
        language: "English",
        timezone: "UTC",
        modules: [],
      });
    }
  }, [user, roles, open]);

  const toggleModule = (module: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.name || !formData.email || (!isEditing && !formData.password) || !formData.roleId) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const url = isEditing ? `/api/users/${user.id}` : `/api/users`;
      const method = isEditing ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        companyId: formData.companyId === "none" ? null : formData.companyId
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save user");

      toast.success(`User ${isEditing ? "updated" : "created"} successfully`);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    toast.success(`Password reset link sent to ${formData.email}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
                {isEditing ? "Edit Mode" : "Create Mode"}
              </Badge>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <div className={`h-2 w-2 rounded-full ${formData.active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {formData.active ? 'Account Active' : 'Account Disabled'}
                </div>
              </div>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                {isEditing ? <User className="h-6 w-6" /> : <User className="h-6 w-6" />}
                {isEditing ? `Modify User: ${formData.name}` : "Create New System User"}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-10 bg-white">
            {/* Section 1: User Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <User className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-widest">User Identity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-500 uppercase">User Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      id="name"
                      placeholder="e.g. John Doe"
                      className="pl-10 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase">Login / Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      className={`pl-10 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 ${isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isEditing}
                      required
                    />
                  </div>
                </div>
              </div>

              {!isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase">System Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      minLength={8}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-indigo-500 font-medium italic mt-1">
                    * Shown only during account creation.
                  </p>
                </div>
              )}
            </div>

            <Separator className="bg-gray-100" />

            {/* Section 2: Role & Company */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <Briefcase className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Role & Company</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase">Permission Group</Label>
                  <Select
                    value={formData.roleId}
                    onValueChange={(val) => val && setFormData({ ...formData, roleId: val })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:ring-indigo-500">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {roles?.map((r: any) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase">Primary Company</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(val) => val && setFormData({ ...formData, companyId: val })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:ring-indigo-500">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Select a company" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="none">Internal System (No Company)</SelectItem>
                      {companies?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Section 3: Module Access Rights */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Module Access Rights</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {MODULES.map((module) => {
                  const isActive = formData.modules.includes(module);
                  return (
                    <button
                      key={module}
                      type="button"
                      onClick={() => toggleModule(module)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                        isActive 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-105" 
                          : "bg-white text-gray-400 border-gray-200 hover:border-indigo-300 hover:text-indigo-500"
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5 opacity-30" />}
                      {module}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Section 4: Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <Globe className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Preferences</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase">System Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(val) => val && setFormData({ ...formData, language: val })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:ring-indigo-500">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(val) => val && setFormData({ ...formData, timezone: val })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:ring-indigo-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {TIMEZONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex items-center justify-between rounded-2xl border border-indigo-50 bg-indigo-50/30 p-5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-indigo-900">Active Status</Label>
                  <div className="text-xs text-indigo-500 font-medium">
                    Toggle to grant or revoke system access immediately.
                  </div>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(val) => setFormData({ ...formData, active: val })}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                type="button" 
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Button>
              {isEditing && (
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleResetPassword}
                  className="rounded-xl border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                >
                  <KeyRound className="mr-2 h-4 w-4" /> Send Reset Link
                </Button>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-48 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200 py-6"
            >
              {loading ? "Processing..." : isEditing ? "Save Changes" : "Create User Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

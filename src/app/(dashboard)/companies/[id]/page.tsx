"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Save, Building, Info, CheckCircle2, Image as ImageIcon, Edit } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyViewPage({ params }: { params: Promise<{ id: string }> | any }) {
  const resolvedParams = params && typeof params.then === 'function' ? use(params) : params;
  const router = useRouter();
  const isNew = resolvedParams.id === "new";
  
  const [isEditMode, setIsEditMode] = useState(isNew);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    country: "",
    currency: "USD",
    fiscalYearStart: "January",
    multiCurrency: false,
    uomAdvanced: false,
    logo: "",
    isPrimary: false,
  });
  
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    if (!isNew) {
      fetchCompany();
    }
    if (typeof window !== 'undefined' && window.location.search.includes('mode=edit')) {
      setIsEditMode(true);
    }
  }, [isNew]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditMode && originalData && JSON.stringify(formData) !== JSON.stringify(originalData)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditMode, formData, originalData]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/companies/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        const loadedData = {
          name: data.name || "",
          taxId: data.taxId || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          currency: data.currency || "USD",
          fiscalYearStart: data.fiscalYearStart || "January",
          multiCurrency: data.multiCurrency || false,
          uomAdvanced: data.uomAdvanced || false,
          logo: data.logo || "",
          isPrimary: data.isPrimary || false,
        };
        setFormData(loadedData);
        setOriginalData(loadedData);
      } else {
        toast.error("Failed to load company");
        router.push("/companies");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Company name is required");
      return;
    }

    try {
      setSaving(true);
      const url = isNew ? "/api/companies" : `/api/companies/${resolvedParams.id}`;
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isNew ? "Company created successfully" : "Company updated successfully");
        if (isNew) {
          const newCompany = await res.json();
          router.push(`/companies/${newCompany.id}`);
        } else {
          setIsEditMode(false);
          fetchCompany();
        }
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save company");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/companies")} className="rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {isNew ? "New Company" : formData.name}
              </h2>
              {!isNew && formData.isPrimary && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  Primary
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {isNew ? "Create a new legal entity" : (isEditMode ? "Edit Mode" : "View Mode")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEditMode ? (
            <Button onClick={() => setIsEditMode(true)} className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl shadow-sm">
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </Button>
          ) : (
            <>
              {!isNew && (
                <Button variant="ghost" onClick={() => { 
                  if (originalData && JSON.stringify(formData) !== JSON.stringify(originalData)) {
                    if (!confirm("You have unsaved changes. Are you sure you want to cancel?")) return;
                  }
                  setIsEditMode(false); 
                  if (originalData) setFormData(originalData); 
                }} className="rounded-xl text-gray-500">
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md shadow-blue-200">
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info Banner */}
      {!isEditMode && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 text-blue-800 text-sm">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <p><strong>View Mode</strong> — Fields are read-only. Click Edit Details to make changes.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Legal Details Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                Legal Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="sm:col-span-2">
                <Label className="text-gray-600">Company Name</Label>
                {isEditMode ? (
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="mt-1.5 rounded-xl border-gray-200 focus-visible:ring-blue-500"
                    placeholder="e.g. Acme Corp"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.name}</p>
                )}
              </div>
              
              <div>
                <Label className="text-gray-600">Tax ID / VAT</Label>
                {isEditMode ? (
                  <Input 
                    value={formData.taxId} 
                    onChange={e => setFormData({...formData, taxId: e.target.value})}
                    className="mt-1.5 rounded-xl border-gray-200"
                    placeholder="e.g. US12345678"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.taxId || "—"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label className="text-gray-600">Street / Address</Label>
                {isEditMode ? (
                  <Input 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="mt-1.5 rounded-xl border-gray-200"
                    placeholder="123 Manufacturing Way"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.address || "—"}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-600">City</Label>
                {isEditMode ? (
                  <Input 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="mt-1.5 rounded-xl border-gray-200"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.city || "—"}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-600">State / Province</Label>
                {isEditMode ? (
                  <Input 
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    className="mt-1.5 rounded-xl border-gray-200"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.state || "—"}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <Label className="text-gray-600">Country</Label>
                {isEditMode ? (
                  <Input 
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="mt-1.5 rounded-xl border-gray-200"
                    placeholder="United States"
                  />
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.country || "—"}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Financial Settings Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Financial Settings
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label className="text-gray-600">Base Currency</Label>
                {isEditMode ? (
                  <select 
                    value={formData.currency}
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                    className="w-full mt-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                ) : (
                  <p className="mt-1 font-medium text-gray-900 inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100">{formData.currency}</p>
                )}
              </div>
              
              <div>
                <Label className="text-gray-600">Fiscal Year Start</Label>
                {isEditMode ? (
                  <select 
                    value={formData.fiscalYearStart}
                    onChange={e => setFormData({...formData, fiscalYearStart: e.target.value})}
                    className="w-full mt-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 font-medium text-gray-900">{formData.fiscalYearStart}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Features & Options */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
                Features & Options
              </h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-gray-900 cursor-pointer">Multi-Currency</Label>
                  <p className="text-sm text-gray-500">Allow transactions in foreign currencies</p>
                </div>
                {isEditMode ? (
                  <Switch 
                    checked={formData.multiCurrency} 
                    onCheckedChange={(c) => setFormData({...formData, multiCurrency: c})}
                  />
                ) : (
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${formData.multiCurrency ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {formData.multiCurrency ? "ON" : "OFF"}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-gray-900 cursor-pointer">Advanced UoM</Label>
                  <p className="text-sm text-gray-500">Enable multiple units of measure</p>
                </div>
                {isEditMode ? (
                  <Switch 
                    checked={formData.uomAdvanced} 
                    onCheckedChange={(c) => setFormData({...formData, uomAdvanced: c})}
                  />
                ) : (
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${formData.uomAdvanced ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {formData.uomAdvanced ? "ON" : "OFF"}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="space-y-0.5">
                  <Label className="text-base text-gray-900 cursor-pointer flex items-center gap-2">
                    Primary Company
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase">Beta</span>
                  </Label>
                  <p className="text-sm text-gray-500">Set as default for new users</p>
                </div>
                {isEditMode ? (
                  <Switch 
                    checked={formData.isPrimary} 
                    onCheckedChange={(c) => setFormData({...formData, isPrimary: c})}
                  />
                ) : (
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${formData.isPrimary ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {formData.isPrimary ? "YES" : "NO"}
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Branding */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                Branding
              </h3>
            </div>
            <div className="p-6">
              <Label className="text-gray-600 block mb-3">Company Logo</Label>
              
              {formData.logo ? (
                <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  <img src={formData.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  {isEditMode && (
                    <button 
                      onClick={() => setFormData({...formData, logo: ""})}
                      className="absolute top-2 right-2 h-6 w-6 bg-white/80 rounded-full flex items-center justify-center shadow text-gray-600 hover:text-red-500 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center ${isEditMode ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors' : 'border-gray-200 bg-gray-50'}`}>
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  {isEditMode ? (
                    <>
                      <p className="text-sm font-medium text-gray-700">Click to upload logo</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No logo uploaded</p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}

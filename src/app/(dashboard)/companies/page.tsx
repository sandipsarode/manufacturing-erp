"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Building, Search, Edit, Eye } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/companies");
      if (res.ok) {
        setCompanies(await res.json());
      } else {
        toast.error("Failed to fetch companies");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.country || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Companies List</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage multiple companies, subsidiaries, or legal entities</p>
        </div>
        <Button onClick={() => router.push("/companies/new")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md shadow-blue-200">
          <Plus className="mr-2 h-4 w-4" /> New Company
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
            className="pl-9 rounded-xl border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">#</th>
                <th className="px-6 py-4 font-semibold">Company Name</th>
                <th className="px-6 py-4 font-semibold">Country</th>
                <th className="px-6 py-4 font-semibold">Currency</th>
                <th className="px-6 py-4 font-semibold">Fiscal Year Start</th>
                <th className="px-6 py-4 font-semibold text-center">Multi-Currency</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4">
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                    </div>
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Building className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-base font-medium text-gray-900">No companies found</p>
                      <p className="text-sm mt-1">Get started by adding a new company.</p>
                      <Button variant="outline" className="mt-4 rounded-xl" onClick={() => router.push("/companies/new")}>
                        Add Company
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{company.name}</span>
                        {company.isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                            Primary
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{company.country || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium text-xs">
                        {company.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{company.fiscalYearStart}</td>
                    <td className="px-6 py-4 text-center">
                      {company.multiCurrency ? (
                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">ON</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">OFF</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          onClick={() => router.push(`/companies/${company.id}`)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                          onClick={() => router.push(`/companies/${company.id}?mode=edit`)}
                          title="Edit Company"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

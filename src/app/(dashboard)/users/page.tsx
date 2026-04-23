"use client";

import { useEffect, useState } from "react";
import { UsersDataTable } from "@/components/users/UsersDataTable";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, companiesRes] = await Promise.all([
        fetch(`/api/users?search=${search}`),
        fetch("/api/roles"),
        fetch("/api/companies"),
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (rolesRes.ok) setRoles(await rolesRes.json());
      if (companiesRes.ok) setCompanies(await companiesRes.json());
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Control access and system permissions</p>
        </div>
        <Button onClick={() => { setSelectedUser(null); setIsDialogOpen(true); }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Admins",      value: (users as any[]).filter(u => u.role?.name === 'Admin').length, icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active",      value: (users as any[]).filter(u => u.active).length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Inactive",    value: (users as any[]).filter(u => !u.active).length, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`${c.bg} ${c.color} h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 rounded-xl border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : (
        <UsersDataTable 
          users={users} 
          onEdit={(user: any) => { setSelectedUser(user); setIsDialogOpen(true); }}
        />
      )}

      <UserFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        user={selectedUser} 
        roles={roles}
        companies={companies}
        onSuccess={fetchData}
      />
      <Toaster position="top-right" />
    </div>
  );
}

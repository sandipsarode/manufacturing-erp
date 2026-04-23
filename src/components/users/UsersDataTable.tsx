"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit2, Key, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export function UsersDataTable({ users, onEdit }: any) {
  const handleResetPassword = async (user: any) => {
    toast.success(`Password reset link sent to ${user.email}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[300px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow 
              key={user.id} 
              className="hover:bg-gray-50/80 cursor-pointer transition-colors" 
              onClick={() => onEdit(user)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-white">
                    {user.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
                  {user.role?.name || "Unknown"}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={user.active ? "active" : "inactive"} />
              </TableCell>
              <TableCell className="text-gray-400 text-xs">
                {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, HH:mm") : "Never"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-gray-100 p-1">
                    <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(user); }} className="rounded-lg text-xs py-2">
                      <Edit2 className="mr-2 h-3.5 w-3.5 text-gray-400" /> Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleResetPassword(user); }} className="rounded-lg text-xs py-2">
                      <Key className="mr-2 h-3.5 w-3.5 text-gray-400" /> Reset Password
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <User className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs">No users found.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

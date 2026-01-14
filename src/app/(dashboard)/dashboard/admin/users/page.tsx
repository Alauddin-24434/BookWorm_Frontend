"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";
import { Trash2, ShieldCheck, UserCog } from "lucide-react";
import { 
  useGetAllUsersQuery, 
  useUpdateUserRoleMutation, 
  useDeleteUserMutation 
} from "@/redux/features/user/userApi";

export default function AdminUsersPage() {
  // --- RTK Query ---
  const { data: usersData, isLoading } = useGetAllUsersQuery(undefined);
  const [updateRole] = useUpdateUserRoleMutation();

  const users = usersData?.data || [];

  // --- Handlers ---
  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const loadingToast = toast.loading("Updating role...");
    try {
      await updateRole({ userId, role: newRole }).unwrap();
      toast.success(`User promoted to ${newRole}`, { id: loadingToast });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update role", { id: loadingToast });
    }
  };


  // --- Table Columns ---
  const columns: TableColumn[] = [
    { key: "name", label: "User Name" },
    { key: "email", label: "Email Address" },
    { 
      key: "role", 
      label: "Role",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {row.role}
        </span>
      )
    },
  ];

  const actions = (row: any) => (
    <div className="flex items-center justify-center gap-3">
      <button 
        onClick={() => handleRoleUpdate(row._id, row.role)}
        className="p-2 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
        title="Change Role"
      >
        <UserCog size={18} /> 
      </button>
      
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 text-sm">Update permissions and manage accounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <ResponsiveTable
          columns={columns}
          data={users}
          actions={actions}
          loading={isLoading}
        />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
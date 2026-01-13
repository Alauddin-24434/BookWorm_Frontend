"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchUsers();
  }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await api.get("/users");
  //     setUsers(response.data.data);
  //   } catch (error) {
  //     toast.error("Failed to load users");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success("User role updated");
      // fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  // Table Columns
  const columns: TableColumn[] = [
    { key: "name", label: "Genre Name" },
    { key: "description", label: "Description" },
  ];

  const actions = (row: any) => (
    <div className="flex items-center space-x-3">
      <button className="text-blue-600 hover:text-blue-900 font-medium transition-colors">
        Edit
      </button>
      <button className="text-red-600 hover:text-red-900 font-medium transition-colors"></button>
    </div>
  );

  return (
    <div className="p-2  py-8">
      <h1 className="text-4xl rounded-lg px-4 py-2 font-serif font-bold text-gray-900 mb-8 border">
        Manage Users
      </h1>

      {/* Table */}
      <ResponsiveTable
        columns={columns}
        data={users}
        actions={actions}
        loading={loading}
      />
    </div>
  );
}

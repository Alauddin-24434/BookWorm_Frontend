"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import React from "react";
import { useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector(selectCurrentUser);


  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-2">
     
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <main className="w-full flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold capitalize">{user.role} Dashboard</h1>
        </header>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const cookieStore = await cookies()
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider >
      <AppSidebar role={"admin"} />

      <main className="container mx-auto ">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
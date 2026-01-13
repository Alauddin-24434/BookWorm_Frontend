'use client';

import { Calendar, Home, Inbox, Search, Settings, Users, BookOpen, Tag, Video } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  roles: ('admin' | 'user')[];
}

// Define sidebar items with role access
const items: SidebarItem[] = [
  { title: "Home", url: "/dashboard", icon: Home, roles: ['admin', 'user'] },
  { title: "My Library", url: "/library", icon: BookOpen, roles: ['user'] },
  { title: "Browse Books", url: "/browse", icon: Search, roles: ['user'] },
  { title: "Tutorials", url: "/dashboard/admin/tutorials", icon: Video, roles: ['admin'] },
  { title: "Manage Users", url: "/dashboard/admin/users", icon: Users, roles: ['admin'] },
  { title: "Manage Books", url: "/dashboard/admin/books", icon: BookOpen, roles: ['admin'] },
  { title: "Manage Genres", url: "/dashboard/admin/genres", icon: Tag, roles: ['admin'] },
  { title: "Moderate Reviews", url: "/dashboard/admin/reviews", icon: Inbox, roles: ['admin'] },

];

interface AppSidebarProps {
  role: 'admin' | 'user';
}

export function AppSidebar({ role }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter(item => item.roles.includes(role)) // filter by role
                .map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center space-x-2">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

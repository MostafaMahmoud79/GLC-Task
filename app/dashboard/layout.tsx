"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import LogoutBtn from "./_components/logout-btn";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, Building2, Activity } from "lucide-react";
import { StoreProvider } from "@/components/providers/store-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/employees",
      label: "Employees",
      icon: Users,
      active: pathname.includes("/employees"),
    },
    {
      href: "/dashboard/departments",
      label: "Departments",
      icon: Building2,
      active: pathname.includes("/departments"),
    },
    {
      href: "/dashboard/activity",
      label: "Activity Log",
      icon: Activity,
      active: pathname.includes("/activity"),
    },
  ];

  return (
    <StoreProvider>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col md:flex-row w-full">
          <Sidebar className="w-full md:w-[250px] lg:w-[300px] flex flex-col p-3 gap-3">
            <SidebarHeader>
              <div className="space-y-2">
                <div className="capitalize font-bold text-lg lg:text-xl">
                  HR Dashboard
                </div>
                {user && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{user.email}</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                )}
              </div>
            </SidebarHeader>

            <SidebarContent className="flex-1 flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-sidebar-accent transition text-sm lg:text-base ${
                      item.active ? "bg-sidebar-accent font-medium" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </SidebarContent>

            <div className="mt-auto">
              <LogoutBtn />
            </div>
          </Sidebar>

          <div className="flex-1 w-full">
            <div className="md:hidden p-4 border-b flex items-center justify-between">
              <SidebarTrigger />
              <span className="font-semibold text-sm">HR Dashboard</span>
            </div>

            <div className="w-full max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </StoreProvider>
  );
}
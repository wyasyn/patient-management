import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

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
import Logo from "./logo";
import DashboardLayout from "@/app/dashboard/layout";
import DashboardNavItem from "./dashboard-nav-item";
import { LogoutButton } from "./logout-button";

// Menu items.
const items = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    name: "Appointments",
    link: "/dashboard/appointments",
    icon: <CalendarDays className="mr-2 h-4 w-4" />,
  },
  {
    name: "Patients",
    link: "/dashboard/patients",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    name: "Recommendations",
    link: "/dashboard/recommendations",
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className=" h-full">
          <SidebarGroupLabel>
            <Logo />
          </SidebarGroupLabel>
          <SidebarGroupContent className="h-full">
            <SidebarMenu className=" pt-4 h-full">
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <DashboardNavItem
                      name={item.name}
                      link={item.link}
                      icon={item.icon}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="mt-auto">
                <LogoutButton />
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Calculator,
  Users,
  Contact,
  BarChart,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/i18n";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { titleKey: "nav.dashboard", url: "/admin", icon: LayoutDashboard },
  { titleKey: "nav.quotations", url: "/admin/quotations", icon: FileText },
  { titleKey: "nav.settlements", url: "/admin/settlements", icon: Calculator },
  { titleKey: "nav.guides", url: "/admin/guides", icon: Contact },
  { titleKey: "nav.guideAssignment", url: "/admin/guide-assignment", icon: Users },
  { titleKey: "nav.reports", url: "/admin/reports", icon: BarChart },
];

const bottomMenuItems = [
  { titleKey: "nav.settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path: string) =>
    path === "/admin" ? currentPath === "/admin" || currentPath === "/admin/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-card">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm tracking-tighter">SE</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-sm text-foreground tracking-tight">
                Travel Agency
              </span>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>메인 메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-accent/50 text-slate-500 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-bold shadow-sm"
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      {!collapsed && <span className="tracking-tight">{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.titleKey}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink
                  to={item.url}
                  className="hover:bg-accent/50 text-slate-500 transition-colors"
                  activeClassName="bg-primary/10 text-primary font-bold shadow-sm"
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {!collapsed && <span className="tracking-tight">{t(item.titleKey)}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {!collapsed && <span>로그아웃</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

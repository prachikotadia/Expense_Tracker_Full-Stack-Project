
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  LineChart,
  CreditCard,
  Wallet,
  Users,
  School,
  Calendar,
  Clock,
  History,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  // Navigation items
  const mainItems = [
    { title: "Dashboard", icon: PieChart, path: "/dashboard" },
    { title: "Transactions", icon: CreditCard, path: "/transactions" },
    { title: "Categories", icon: LineChart, path: "/categories" },
    { title: "Student Expenses", icon: School, path: "/student-expenses" },
    { title: "Family Expenses", icon: Users, path: "/family-expenses" },
    { title: "Analytics", icon: PieChart, path: "/analytics" },
  ];

  const secondaryItems = [
    { title: "Calendar", icon: Calendar, path: "/calendar" },
    { title: "Upcoming", icon: Clock, path: "/upcoming" },
    { title: "History", icon: History, path: "/history" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-4">
          <div className="flex-1">
            <Link to="/" className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">ExpensiMate</span>
            </Link>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {user && (
          <div className="flex items-center gap-3 p-4 mt-2">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

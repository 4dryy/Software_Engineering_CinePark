"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LogOut, LayoutDashboard, User, ListChecks, Film, Clapperboard, Info } from "lucide-react";
import { logout } from "@/lib/auth-actions";
import { Logo } from "@/components/Logo";
import type { User as AuthUser } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quiz", label: "Personality Quiz", icon: ListChecks },
  { href: "/recommendations", label: "Film Recommendations", icon: Film },
  { href: "/local-cinemas", label: "Local Cinemas", icon: Clapperboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/about", label: "About CINEPARK", icon: Info },
];

interface AppSidebarProps {
  user: AuthUser | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         {user && (
          <div className="px-2 py-3 text-sm">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <form action={handleLogout} className="w-full">
            <Button variant="ghost" className="w-full justify-start" type="submit">
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
            </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}

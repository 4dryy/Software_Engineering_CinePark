"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "./AppSidebar"; // For mobile drawer content
import type { User } from "@/lib/types";
import { Logo } from "@/components/Logo";


interface AppHeaderProps {
  user: User | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden"> {/* Mobile navigation toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col w-full max-w-[calc(100vw-4rem)] sm:max-w-xs">
             {/* Pass user to AppSidebar if needed for mobile view specifics */}
            <AppSidebar user={user} />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex-1 md:hidden"> {/* Logo for mobile centered */}
        <Link href="/dashboard" className="flex justify-center">
          <Logo size="sm"/>
        </Link>
      </div>
      
      <div className="hidden md:flex flex-1"> {/* Empty div to push user menu to the right on desktop */}
        {/* Desktop: Header elements can go here if needed, or leave empty if sidebar is primary nav */}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {/* User Dropdown can be added here if needed */}
      </div>
    </header>
  );
}

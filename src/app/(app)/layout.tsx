
import type { ReactNode } from 'react';
import { getCurrentUser, logout } from '@/lib/auth-actions'; // Ensure logout is imported
// import { redirect } from 'next/navigation'; // Not needed here anymore for this logic
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';


export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    // If getCurrentUser returns null, the session is invalid or user not found.
    // Call logout() to clear the cookie and redirect the user.
    // logout() itself handles the redirection.
    await logout(); 
    return null; // Stop rendering the rest of the layout, as redirect will occur.
  }
  
  return (
    <SidebarProvider defaultOpen={true}> 
      <div className="flex min-h-screen w-full bg-muted/40">
        <div className="hidden md:block"> 
            <AppSidebar user={user} />
        </div>
        <div className="flex flex-col flex-1">
          <AppHeader user={user} />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

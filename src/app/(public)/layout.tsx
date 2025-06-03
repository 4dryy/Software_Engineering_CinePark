import type { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <main className="w-full flex-grow flex flex-col items-center">
        {children}
      </main>
    </div>
  );
}

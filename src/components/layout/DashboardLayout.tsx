import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "admin" | "invigilator";
  userName: string;
  userId: string;
  pageTitle: string;
}

export function DashboardLayout({
  children,
  userRole,
  userName,
  userId,
  pageTitle,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar userRole={userRole} userName={userName} userId={userId} />
      
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

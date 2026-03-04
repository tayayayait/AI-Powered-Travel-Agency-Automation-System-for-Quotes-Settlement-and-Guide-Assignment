import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

interface AdminAppLayoutProps {
  children: React.ReactNode;
}

export function AdminAppLayout({ children }: AdminAppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background antialiased selection:bg-primary/20">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto">
            {/* 
              Swiss Style / Bento Grid Container 
              Removes max-w bounds for full-bleed data density on large desktop screens 
              Adds the standard gap-6 spacing 
            */}
            <div className="p-4 sm:p-5 lg:p-6 mx-auto min-h-full space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

import React from "react";
import { MobileTopbar } from "./MobileTopbar";
import { MobileActionBar } from "./MobileActionBar";

interface MobileLayoutProps {
  children: React.ReactNode;
  actionBar?: React.ReactNode;
}

export function MobileLayout({ children, actionBar }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center w-full">
      <div className="w-full max-w-[480px] bg-background min-h-screen flex flex-col relative shadow-md">
        <MobileTopbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full pb-[64px] bg-slate-50">
          <div className="p-4 sm:p-5 safe-area-bottom min-h-full">
            {children}
          </div>
        </main>
        
        {actionBar || <MobileActionBar />}
      </div>
    </div>
  );
}

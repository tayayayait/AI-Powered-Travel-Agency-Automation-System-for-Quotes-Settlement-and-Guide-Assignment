import { cn } from "@/lib/utils";

interface MobileActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function MobileActionBar({ children, className, ...props }: MobileActionBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="하단 액션 바"
      className={cn(
        "fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] z-sticky h-[64px] border-t bg-background px-4 py-2 opacity-100 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

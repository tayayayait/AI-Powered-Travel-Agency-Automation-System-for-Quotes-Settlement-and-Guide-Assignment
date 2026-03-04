import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        Draft: "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
        InReview: "border-transparent bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-300",
        Approved: "border-transparent bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
        Rejected: "border-transparent bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300",
        Locked: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300",
      },
    },
    defaultVariants: {
      status: "Draft",
    },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string;
}

function StatusBadge({ className, status, label, ...props }: StatusBadgeProps) {
  // 상태별 기본 라벨 (번역 전 fallback)
  const defaultLabels: Record<string, string> = {
    Draft: "임시저장",
    InReview: "결재중",
    Approved: "승인됨",
    Rejected: "반려됨",
    Locked: "확정/잠금",
  };

  const displayLabel = label || t(`status.${status || "Draft"}`);

  return (
    <div
      className={cn(statusBadgeVariants({ status }), className)}
      role="status"
      aria-label={`상태: ${displayLabel}`}
      {...props}
    >
      {displayLabel}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };

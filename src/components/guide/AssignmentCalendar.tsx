// src/components/guide/AssignmentCalendar.tsx
import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import { GuideAssignmentDetail } from "@/types/guide";

interface AssignmentCalendarProps {
  assignments: GuideAssignmentDetail[];
  onEventClick?: (assignment: GuideAssignmentDetail) => void;
}

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  Pending: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  Assigned: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
  "In Progress": { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  Completed: { bg: "#e5e7eb", border: "#6b7280", text: "#374151" },
  Cancelled: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
};

export function AssignmentCalendar({ assignments, onEventClick }: AssignmentCalendarProps) {
  const events: EventInput[] = useMemo(() => {
    return assignments.map((a) => {
      const colors = statusColors[a.status] || statusColors.Pending;
      return {
        id: a.id,
        title: `${a.title} (${a.clientName})`,
        start: a.startDate,
        end: a.endDate,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: { assignment: a },
      };
    });
  }, [assignments]);

  const handleEventClick = (info: EventClickArg) => {
    const assignment = info.event.extendedProps.assignment as GuideAssignmentDetail;
    onEventClick?.(assignment);
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        buttonText={{
          today: "오늘",
          month: "월간",
          week: "주간",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={3}
        moreLinkText={(num) => `+${num}건 더보기`}
        eventDisplay="block"
        eventTimeFormat={{ hour: undefined, minute: undefined }}
        displayEventEnd={false}
      />

      {/* 범례 */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
        {Object.entries(statusColors).map(([status, colors]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            />
            <span className="text-slate-600">{status === "Pending" ? "미배정" : status === "Assigned" ? "배정완료" : status === "In Progress" ? "진행중" : status === "Completed" ? "완료" : "취소"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

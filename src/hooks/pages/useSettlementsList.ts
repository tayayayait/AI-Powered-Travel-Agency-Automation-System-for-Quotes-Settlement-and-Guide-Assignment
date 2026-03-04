import { useState } from "react";
import { useSettlements } from "@/hooks/use-settlements";
import { SettlementStatus } from "@/types/settlement";

export function useSettlementsList() {
  const { data: settlements, isLoading } = useSettlements();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | "All">("All");

  const statusLabels: Record<SettlementStatus, string> = {
    Pending: "대기/진행중",
    Completed: "완료됨",
    Disputed: "보류/이슈",
  };

  const filteredSettlements = settlements?.filter((s) => {
    const matchesSearch = s.title.includes(search) || s.clientName.includes(search);
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusLabels,
    filteredSettlements
  };
}

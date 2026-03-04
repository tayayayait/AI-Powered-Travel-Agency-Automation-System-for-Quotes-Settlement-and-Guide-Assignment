import { useState, useMemo } from "react";
import { useQuotations } from "@/hooks/use-quotations";
import { QuotationStatus } from "@/types";

const ITEMS_PER_PAGE = 10;

export type SortOption = "latest" | "oldest" | "price_desc" | "price_asc" | "date_asc" | "date_desc";

export function useQuotationsList() {
  const { data: quotations, isLoading } = useQuotations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "All">("All");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const statusLabels: Record<QuotationStatus, string> = {
    Draft: "임시저장",
    InReview: "결재중",
    Approved: "승인됨",
    Rejected: "반려됨",
    Locked: "확정/잠금",
  };

  // 1. 필터 적용
  const filteredQuotations = useMemo(() => {
    if (!quotations) return [];
    return quotations.filter((q) => {
      const matchesSearch = q.title.includes(search) || q.clientName.includes(search);
      const matchesStatus = statusFilter === "All" || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  // 2. 정렬 적용
  const sortedQuotations = useMemo(() => {
    return [...filteredQuotations].sort((a, b) => {
      const priceA = (a.proposedPriceKRW || 0) * (a.paxCount || 1);
      const priceB = (b.proposedPriceKRW || 0) * (b.paxCount || 1);
      
      switch (sortBy) {
        case "latest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price_desc":
          return priceB - priceA;
        case "price_asc":
          return priceA - priceB;
        case "date_asc":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "date_desc":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return 0;
      }
    });
  }, [filteredQuotations, sortBy]);

  // 3. 페이징 처리
  const totalPages = Math.ceil(sortedQuotations.length / ITEMS_PER_PAGE) || 1;
  const currentData = sortedQuotations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 검색/필터 변경 시 1페이지로 리셋
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: QuotationStatus | "All") => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  return {
    isLoading,
    search,
    statusFilter,
    sortBy,
    currentPage,
    totalPages,
    statusLabels,
    currentData,
    sortedQuotationsLength: sortedQuotations.length,
    ITEMS_PER_PAGE,
    handleSearchChange,
    handleStatusChange,
    setSortBy,
    setCurrentPage
  };
}

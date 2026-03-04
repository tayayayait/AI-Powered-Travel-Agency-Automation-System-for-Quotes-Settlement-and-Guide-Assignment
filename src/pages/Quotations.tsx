import { Link } from "react-router-dom";
import { Plus, Search, FileText, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuotationStatus, Quotation } from "@/types";
import { useQuotationsList, SortOption } from "@/hooks/pages/useQuotationsList";

export default function Quotations() {
  const {
    isLoading,
    search,
    statusFilter,
    sortBy,
    currentPage,
    totalPages,
    statusLabels,
    currentData,
    sortedQuotationsLength,
    ITEMS_PER_PAGE,
    handleSearchChange,
    handleStatusChange,
    setSortBy,
    setCurrentPage
  } = useQuotationsList();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">견적서 관리</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">고객 요청 견적을 확인하고 새로운 견적서를 작성합니다.</p>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-white rounded-lg px-5 shadow-sm">
          <Link to="/admin/quotations/new">
            <Plus className="h-4 w-4 mr-2" />
            새 견적 작성
          </Link>
        </Button>
      </div>

      {/* Main Bento Box */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 flex flex-col overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-5 lg:p-6 border-b border-border/50 flex flex-col sm:flex-row items-center gap-4 bg-card">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="견적명 또는 고객사 검색..." 
              className="pl-9 bg-card border-border/80 focus-visible:ring-primary/20 rounded-lg shadow-sm h-10"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <Button
              variant={statusFilter === "All" ? "default" : "outline"}
              onClick={() => handleStatusChange("All")}
              className={`rounded-full h-9 px-4 text-xs font-bold transition-all ${statusFilter === "All" ? "bg-slate-800 text-white shadow-sm" : "bg-transparent border-border/80 text-slate-500 hover:text-slate-800"}`}
            >
              전체
            </Button>
            {(Object.entries(statusLabels) as [QuotationStatus, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "outline"}
                onClick={() => handleStatusChange(key)}
                className={`rounded-full h-9 px-4 text-xs font-bold transition-all ${statusFilter === key ? "bg-slate-800 text-white shadow-sm" : "bg-transparent border-border/80 text-slate-500 hover:text-slate-800"}`}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="w-[160px] shrink-0">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="h-10 bg-card border-border/80 rounded-lg shadow-sm">
                <ArrowUpDown className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="정렬 방식" className="font-bold text-slate-700" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-md">
                <SelectItem value="latest">최신 작성순</SelectItem>
                <SelectItem value="oldest">오래된 작성순</SelectItem>
                <SelectItem value="date_asc">일정 임박순</SelectItem>
                <SelectItem value="date_desc">일정 여유순</SelectItem>
                <SelectItem value="price_desc">금액 높은순</SelectItem>
                <SelectItem value="price_asc">금액 낮은순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 flex flex-col min-h-[400px] bg-card">
          {isLoading ? (
            <div className="p-6 space-y-4 flex-1">
              {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          ) : !currentData?.length ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 px-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">조회된 견적이 없습니다</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                {search || statusFilter !== "All"
                  ? "검색 조건에 맞는 견적 문서가 존재하지 않습니다. 필터를 변경해보세요."
                  : "현재 작성된 견적이 없습니다. 상단의 새 견적 작성 버튼을 눌러 첫 견적을 생성해보세요."}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-border/50">
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">견적 번호</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">고객사/행사명</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">행사 기간</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">인원</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">예상 견적가</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {currentData.map((quotation) => (
                      <tr key={quotation.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-[11px] font-mono text-slate-400">
                          <Link to={`/admin/quotations/${quotation.id}`} className="group-hover:text-primary transition-colors">
                            #{quotation.id.split("-")[0].toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <Link to={`/admin/quotations/${quotation.id}`} className="font-bold text-slate-800 hover:text-primary transition-colors truncate max-w-[200px]">
                              {quotation.title}
                            </Link>
                            <span className="text-[11px] font-medium text-slate-500 mt-0.5">{quotation.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {quotation.startDate} <span className="text-slate-400 mx-1">~</span> {quotation.endDate}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium tabular-nums">
                          {quotation.paxCount}명
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800 tabular-nums">
                          {formatCurrency((quotation.proposedPriceKRW || 0) * (quotation.paxCount || 1), "KRW")}원
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <StatusBadge status={quotation.status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-border/50 flex items-center justify-end text-sm bg-card mt-auto">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {sortedQuotationsLength} ITEMS
                    </span>
                    <div className="flex gap-1 items-center bg-slate-50/80 p-1 rounded-lg border border-border/50">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-md text-slate-500 hover:text-slate-900 data-[disabled]:opacity-50"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center px-2 text-[11px] font-bold text-slate-700 min-w-[3rem] justify-center tabular-nums">
                        {currentPage} / {totalPages}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-md text-slate-500 hover:text-slate-900 data-[disabled]:opacity-50"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Plus, Search, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
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
import { useSettlementsList } from "@/hooks/pages/useSettlementsList";
import { SettlementStatus } from "@/types/settlement";

export default function Settlements() {
  const {
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusLabels,
    filteredSettlements
  } = useSettlementsList();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">정산 내역 관리</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">행사 정산 내역을 확인하고, 결제 및 마감을 처리합니다.</p>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-white rounded-lg px-5 shadow-sm">
          <Link to="/admin/settlements/new">
            <Plus className="h-4 w-4 mr-2" />
            정산서 생성
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={statusFilter === "All" ? "default" : "outline"}
              onClick={() => setStatusFilter("All")}
              className={`rounded-full h-9 px-4 text-xs font-bold transition-all ${statusFilter === "All" ? "bg-slate-800 text-white shadow-sm" : "bg-transparent border-border/80 text-slate-500 hover:text-slate-800"}`}
            >
              전체
            </Button>
            {(Object.entries(statusLabels) as [SettlementStatus, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "outline"}
                onClick={() => setStatusFilter(key as SettlementStatus)}
                className={`rounded-full h-9 px-4 text-xs font-bold transition-all ${statusFilter === key ? "bg-slate-800 text-white shadow-sm" : "bg-transparent border-border/80 text-slate-500 hover:text-slate-800"}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 flex flex-col min-h-[400px] bg-card">
          {isLoading ? (
            <div className="p-6 space-y-4 flex-1">
              {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          ) : !filteredSettlements?.length ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 px-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">조회된 정산 내역이 없습니다</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                {search || statusFilter !== "All"
                  ? "검색 조건에 맞는 정산서가 존재하지 않습니다."
                  : "현재 작성된 정산서가 없습니다. 견적 승인 후 새로운 정산서를 생성해보세요."}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-border/50">
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">정산 번호</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">연결 견적명 / 고객사</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">예상 총액</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">실제 지출</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">잔액/차액</th>
                      <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredSettlements.map((settlement) => (
                      <tr key={settlement.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-[11px] font-mono text-slate-400">
                          <Link to={`/admin/settlements/${settlement.id}`} className="group-hover:text-primary transition-colors">
                            #{settlement.id.split("-")[0].toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <Link to={`/admin/settlements/${settlement.id}`} className="font-bold text-slate-800 hover:text-primary transition-colors truncate max-w-[200px]">
                              {settlement.title}
                            </Link>
                            <span className="text-[11px] font-medium text-slate-500 mt-0.5">{settlement.clientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-600 tabular-nums">
                          {formatCurrency(settlement.totalExpectedKRW, "KRW")}원
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800 tabular-nums">
                          {formatCurrency(settlement.totalActualKRW, "KRW")}원
                        </td>
                        <td className={`px-6 py-4 text-right font-bold tabular-nums ${settlement.balanceKRW < 0 ? 'text-red-500 bg-red-50/30' : 'text-emerald-600'}`}>
                          {settlement.balanceKRW > 0 ? "+" : ""}{formatCurrency(settlement.balanceKRW, "KRW")}원
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <StatusBadge 
                              status={
                                settlement.status === "Pending" ? "InReview" :
                                settlement.status === "Completed" ? "Approved" : "Rejected"
                              } 
                              label={statusLabels[settlement.status]} 
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Count Indicator */}
              <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm bg-card mt-auto text-muted-foreground">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {filteredSettlements.length} SETTLEMENTS
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

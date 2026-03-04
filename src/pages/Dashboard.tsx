import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calculator,
  Users,
  ArrowRight
} from "lucide-react";
import { useDashboard } from "@/hooks/pages/useDashboard";
import { t } from "@/lib/i18n";

export default function Dashboard() {
  const {
    quotations,
    isLoading,
    totalQuotations,
    pendingReview,
    approved,
    rejected,
    pendingSettlements,
    unassignedGuides,
    formatCurrency
  } = useDashboard();

  const stats = [
    { title: t("nav.quotations"), value: totalQuotations, icon: FileText, sub: "전체 견적 건수", color: "text-primary" },
    { title: "승인 대기", value: pendingReview, icon: Clock, sub: "결재 검토 필요", color: "text-cyan-600" },
    { title: "승인 완료", value: approved, icon: CheckCircle, sub: "확정/잠금 포함", color: "text-green-600" },
    { title: "반려", value: rejected, icon: XCircle, sub: "수정 후 재상신 필요", color: "text-red-600" },
  ];

  const quickLinks = [
    { title: "정산 대기", count: pendingSettlements, icon: Calculator, href: "/admin/settlements", color: "text-amber-600" },
    { title: "미배정 가이드", count: unassignedGuides, icon: Users, href: "/admin/guide-assignment", color: "text-violet-600" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">{t("nav.dashboard")}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">견적·정산·가이드 현황을 한눈에 확인하세요.</p>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { 
            title: "전체 견적", 
            value: totalQuotations, 
            icon: FileText, 
            sub: "+12%", 
            subColor: "text-emerald-600 bg-emerald-50", 
            iconStyle: "text-primary bg-primary/10" 
          },
          { 
            title: "정산 대기", 
            value: pendingSettlements, 
            icon: Calculator, 
            sub: "+5%", 
            subColor: "text-amber-600 bg-amber-50", 
            iconStyle: "text-amber-500 bg-amber-50" 
          },
          { 
            title: "미배정 가이드", 
            value: unassignedGuides, 
            icon: Users, 
            sub: "-2%", 
            subColor: "text-red-500 bg-red-50", 
            iconStyle: "text-emerald-500 bg-emerald-50" 
          },
          { 
            title: "승인 대기 견적", 
            value: pendingReview, 
            icon: Clock, 
            sub: "필요", 
            subColor: "text-blue-600 bg-blue-50", 
            iconStyle: "text-blue-600 bg-blue-50" 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2 rounded-lg ${stat.iconStyle}`}>
                <stat.icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${stat.subColor}`}>
                {stat.sub}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-2" />
              ) : (
                <p className="text-3xl font-bold tracking-tighter tabular-nums mt-1 text-slate-800">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Middle Row Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (Placeholder width 2 cols) */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-sm border border-border/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 tracking-tight text-lg">Revenue Analytics</h3>
            <button className="text-xs font-bold text-primary hover:underline">View Details</button>
          </div>
          <div className="flex-1 flex flex-col justify-end min-h-[160px]">
            {/* Mock Chart Bars */}
            <div className="h-40 flex items-end gap-3 w-full px-2">
              {[40, 60, 55, 75, 65, 85, 100].map((h, idx) => (
                <div key={idx} className="flex-1 bg-primary/20 hover:bg-primary/80 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Recent Quotes List (1 col) */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 tracking-tight text-lg">Recent Quotes</h3>
            <Link to="/admin/quotations" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
              전체 보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)
            ) : !quotations?.length ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">최근 견적이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-0.5 divide-y divide-border/30">
                {quotations.slice(0, 4).map((q) => (
                  <Link
                    key={q.id}
                    to={`/admin/quotations/${q.id}`}
                    className="flex items-center justify-between py-3 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:bg-primary/5 transition-colors">
                        #{q.id.slice(0, 4).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate max-w-[140px]">{q.title}</p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{q.clientName} • {q.paxCount} Pax</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-end w-20">
                      <StatusBadge status={q.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Assignments Table */}
      <section className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 tracking-tight text-lg">Latest Operational Alerts</h3>
          <Link to="/admin/guide-assignment" className="text-xs font-bold text-primary hover:underline">
            가이드 배정 관리로 이동
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pendingSettlements > 0 && (
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">정산 대기</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">
                    현재 처리가 필요한 정산 금액이 {pendingSettlements}건 있습니다.
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to="/admin/settlements" className="text-xs font-bold text-primary hover:underline">처리하기 &rarr;</Link>
                  </td>
                </tr>
              )}
              {unassignedGuides > 0 && (
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">가이드 배정 대기</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">
                    가이드 배정이 필요한 행사가 {unassignedGuides}건 있습니다.
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to="/admin/guide-assignment" className="text-xs font-bold text-primary hover:underline">배정하기 &rarr;</Link>
                  </td>
                </tr>
              )}
              {pendingSettlements === 0 && unassignedGuides === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500 text-sm font-medium">
                    모든 운영 알림이 처리되었습니다. 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

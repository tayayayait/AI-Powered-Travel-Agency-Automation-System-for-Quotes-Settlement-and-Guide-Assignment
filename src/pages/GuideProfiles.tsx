import { GuideProfile, GuideTier } from "@/types/guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit2,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  useGuideProfilesList,
  tierColors,
} from "@/hooks/pages/useGuideProfilesList";

export default function GuideProfiles() {
  const {
    isLoading,
    search,
    setSearch,
    isDialogOpen,
    setIsDialogOpen,
    editingId,
    formData,
    setFormData,
    filteredGuides,
    handleOpenNew,
    handleOpenEdit,
    handleSave,
    toggleStatus,
  } = useGuideProfilesList();

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">
            가이드 প্রো필 정보
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            가이드 기본 정보 및 배정 지역, 실적 현황을 조회·관리합니다.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="shrink-0 bg-primary hover:bg-primary/90 text-white rounded-lg px-5 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          신규 가이드 등록
        </Button>
      </div>

      {/* Main Bento Box */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 flex flex-col overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 lg:p-6 border-b border-border/50 bg-card">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="이름 또는 전화번호로 검색..."
              className="pl-10 bg-card border-border/80 focus-visible:ring-primary/20 rounded-lg shadow-sm h-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 flex flex-col min-h-[400px] bg-card">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-border/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">가이드명</th>
                  <th className="px-6 py-4">연락처</th>
                  <th className="px-6 py-4">등급/티어</th>
                  <th className="px-6 py-4">전문 지역</th>
                  <th className="px-6 py-4 text-right">누적 행사</th>
                  <th className="px-6 py-4 text-right">쇼핑 실적</th>
                  <th className="px-6 py-4 text-right">옵션 실적</th>
                  <th className="px-6 py-4 text-center">활성 상태</th>
                  <th className="px-6 py-4 w-[100px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredGuides.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <UserX className="w-10 h-10 mb-3 opacity-20" />
                        <h3 className="text-base font-bold text-slate-800 tracking-tight">
                          조회된 가이드가 없습니다
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                          검색 조건에 맞는 가이드가 존재하지 않거나 새로
                          등록해야 합니다.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGuides.map((g) => (
                    <tr
                      key={g.id}
                      className={`hover:bg-slate-50/50 transition-colors group ${g.status !== "Active" ? "opacity-60 bg-slate-50/50 grayscale-[20%]" : ""}`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          {g.name}
                          {g.complaint_count > 0 && (
                            <Badge
                              variant="outline"
                              className="text-red-600 bg-red-50 border-red-200 px-1.5 py-0 h-5 text-[10px] uppercase font-bold tracking-widest"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" /> 컴플레인{" "}
                              {g.complaint_count}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 tabular-nums">
                        {g.phone}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={`font-bold uppercase tracking-wider text-[10px] ${tierColors[g.tier] || "bg-slate-100 text-slate-600"}`}
                        >
                          {g.tier}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 w-max max-w-[200px]">
                          {g.regions?.map((r) => (
                            <span
                              key={r}
                              className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 border border-slate-200/60 shadow-sm"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600 tabular-nums">
                        {g.total_tours || 0}건
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 tabular-nums tracking-tight">
                        {formatCurrency(g.total_shopping_revenue || 0, "KRW")}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 tabular-nums tracking-tight">
                        {formatCurrency(g.total_option_revenue || 0, "KRW")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${g.status === "Active" ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700" : "text-slate-400 bg-slate-100 hover:bg-slate-200 hover:text-slate-600"}`}
                            onClick={() => toggleStatus(g)}
                            title={
                              g.status === "Active"
                                ? "비활성화 처리하기"
                                : "활성화 처리하기"
                            }
                          >
                            {g.status === "Active" ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(g)}
                          className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                          수정
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Count Footer */}
          <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm bg-card text-muted-foreground mt-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {filteredGuides.length} GUIDES FOUND
            </span>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "가이드 프로필 수정" : "가이드 신규 등록"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              가이드 프로필 정보를 입력하거나 수정하는 폼입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">이름 (Name)</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">전화번호 (Phone)</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>가이드 등급 (Tier)</Label>
              <Select
                value={formData.tier || "Bronze"}
                onValueChange={(val: GuideTier) =>
                  setFormData((p) => ({ ...p, tier: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze (신규/기본)</SelectItem>
                  <SelectItem value="Silver">Silver (경력직)</SelectItem>
                  <SelectItem value="Gold">Gold (우수)</SelectItem>
                  <SelectItem value="Platinum">Platinum (최우수)</SelectItem>
                  <SelectItem value="Diamond">Diamond (VVIP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>담당 가능 지역 (구분자: 쉼표)</Label>
              <Input
                placeholder="예: 방콕, 파타야, 푸켓"
                value={formData.regions?.join(", ") || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    regions: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>외국어 능력 (구분자: 쉼표)</Label>
              <Input
                placeholder="예: Korean, Thai, English"
                value={formData.languages?.join(", ") || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    languages: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.phone}
            >
              {editingId ? "저장" : "등록완료"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

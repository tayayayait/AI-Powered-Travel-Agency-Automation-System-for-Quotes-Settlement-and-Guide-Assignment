import { Search, MapPin, CalendarDays, UserCheck, Sparkles, AlertTriangle, List, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GuideAssignmentStatus } from "@/types/guide";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; 
import { RouteMap } from "@/components/ui/route-map";
import { AssignmentCalendar } from "@/components/guide/AssignmentCalendar";
import { useGuideAssignmentList } from "@/hooks/pages/useGuideAssignmentList";

export default function GuideAssignment() {
  const {
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    selectedAssignment,
    setSelectedAssignment,
    isAiRecommending,
    setIsAiRecommending,
    aiResults,
    aiLoading,
    statusLabels,
    filteredAssignments,
    getOverlappingAssignment,
    handleAssign,
    getAiScore,
    sortedGuides,
    assignMutationIsPending,
    isGeminiAvailable
  } = useGuideAssignmentList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">가이드 배정</h1>
          <p className="text-muted-foreground">행사 일정에 맞춰 전담 가이드를 배정합니다.</p>
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-auto">
          <TabsList>
            <TabsTrigger value="list"><List className="w-4 h-4 mr-2" /> 목록형</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarIcon className="w-4 h-4 mr-2" /> 캘린더/일정표</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={viewMode} className="w-full">
        <TabsContent value="list" className="mt-0 space-y-4">
          {/* Main Bento Box */}
          <div className="bg-card rounded-xl shadow-sm border border-border/50 flex flex-col overflow-hidden">
            
            {/* Filter Bar */}
            <div className="p-5 lg:p-6 border-b border-border/50 flex flex-col sm:flex-row items-center gap-4 bg-card">
              <div className="relative flex-1 w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="견적명 또는 고객사 검색..." 
                  className="pl-9 bg-card border-border/80 focus-visible:ring-primary/20 rounded-lg shadow-sm h-10 w-full"
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
                {(Object.entries(statusLabels) as [GuideAssignmentStatus, string][]).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={statusFilter === key ? "default" : "outline"}
                    onClick={() => setStatusFilter(key as GuideAssignmentStatus)}
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
              ) : !filteredAssignments?.length ? (
                <div className="flex flex-col items-center justify-center flex-1 py-20 px-4 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <UserCheck className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">조회된 배정 내역이 없습니다</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                    {search || statusFilter !== "All"
                      ? "검색 조건에 맞는 배정서가 존재하지 않습니다."
                      : "현재 대기중인 배정 건이 없습니다."}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-border/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                          <th className="px-6 py-4">연결 견적명 / 고객사</th>
                          <th className="px-6 py-4">행사 일정</th>
                          <th className="px-6 py-4">담당 가이드</th>
                          <th className="px-6 py-4 text-center">배정 상태</th>
                          <th className="px-6 py-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {filteredAssignments.map((assignment) => (
                          <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 hover:text-primary transition-colors truncate max-w-[200px]">
                                  {assignment.title}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 mt-0.5">{assignment.clientName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center text-[13px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded w-max">
                                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                {assignment.startDate} <span className="text-slate-300 mx-1">~</span> {assignment.endDate}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {assignment.assignedGuide ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-[11px] border border-indigo-100">
                                    {assignment.assignedGuide.name.substring(0, 1)}
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-bold text-slate-800 text-[13px]">{assignment.assignedGuide.name}</p>
                                      <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 uppercase font-bold tracking-wider">{assignment.assignedGuide.tier}</Badge>
                                    </div>
                                    <div className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                                      {assignment.assignedGuide.phone} 
                                      {assignment.ai_score && (
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0 rounded flex items-center ml-1">
                                          <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI {assignment.ai_score}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
                                  미배정 (대기중)
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <StatusBadge 
                                  status={
                                    assignment.status === "Assigned" ? "Approved" : 
                                    assignment.status === "Pending" ? "Draft" : 
                                    assignment.status === "In Progress" ? "InReview" : "Locked"
                                  } 
                                  label={statusLabels[assignment.status]} 
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button 
                                variant={assignment.status === "Pending" ? "default" : "outline"} 
                                size="sm"
                                onClick={() => setSelectedAssignment(assignment)}
                                className={assignment.status === "Pending" ? "bg-primary hover:bg-primary/90 text-white shadow-sm font-bold text-[11px] h-8" : "font-bold text-[11px] h-8 text-slate-600 border-border/80 bg-white"}
                              >
                                {assignment.status === "Pending" ? "가이드 배정" : "상세/재배정"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Count Footer */}
                  <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm bg-card mt-auto text-muted-foreground">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {filteredAssignments.length} ASSIGNMENTS
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        <Sheet open={!!selectedAssignment} onOpenChange={(open) => {
        if (!open) {
          setSelectedAssignment(null);
          setIsAiRecommending(false);
        }
      }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-slate-50/50">
          <SheetHeader>
            <SheetTitle>가이드 매칭 (AI & 수동)</SheetTitle>
            <SheetDescription>
              행사 조건에 가장 잘 맞는 가이드를 선택하세요.
            </SheetDescription>
          </SheetHeader>
          
          {selectedAssignment && (
            <div className="mt-6 space-y-6">
              <div className="bg-white border p-4 rounded-xl shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none">{selectedAssignment.status}</Badge>
                    <h4 className="font-bold text-lg">{selectedAssignment.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{selectedAssignment.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium">
                  <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                  {selectedAssignment.startDate} ~ {selectedAssignment.endDate}
                </div>
                {selectedAssignment.meetingPoint && (
                  <div className="flex items-center text-sm font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    미팅: {selectedAssignment.meetingPoint}
                  </div>
                )}
              </div>

              {/* 맵 */}
              <div className="rounded-xl overflow-hidden border bg-white p-2">
                <h4 className="text-xs font-bold text-slate-500 mb-2 ml-1 uppercase">투어 주요 동선</h4>
                <RouteMap 
                  locations={[
                    { lat: 13.689999, lng: 100.750112, label: "1", title: "수완나품 공항" },
                    { lat: 13.746816, lng: 100.539316, label: "2", title: "방콕 주요 호텔" },
                    { lat: 12.923555, lng: 100.882455, label: "3", title: "파타야" }
                  ]}
                  height="160px" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-700">추천 가이드 후보군</h3>
                    {isAiRecommending && (
                      <Badge variant="outline" className={`text-[10px] h-5 ${isGeminiAvailable() ? 'text-green-600 border-green-300 bg-green-50' : 'text-amber-600 border-amber-300 bg-amber-50'}`}>
                        {isGeminiAvailable() ? '🧠 Gemini 연동' : '📊 Fallback 모드'}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant={isAiRecommending ? "default" : "outline"} 
                    size="sm" 
                    className={isAiRecommending ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "text-indigo-600 border-indigo-200 border-2 bg-indigo-50/50 hover:bg-indigo-100"}
                    onClick={() => setIsAiRecommending(!isAiRecommending)}
                    disabled={aiLoading}
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
                    AI 스마트 매칭
                  </Button>
                </div>
                
                <div className="space-y-3 pb-8">
                  {sortedGuides.map((guide, idx) => {
                    const aiScore = getAiScore(guide.id);
                    const overlap = getOverlappingAssignment(guide.id);
                    const isSelected = selectedAssignment.assignedGuideId === guide.id;
                    const isTopAi = isAiRecommending && idx === 0 && !overlap;
                    
                    return (
                      <Card 
                        key={guide.id} 
                        className={`transition-all ${isSelected ? 'border-primary shadow-md bg-primary/5' : ''} ${isTopAi ? 'border-indigo-400 bg-indigo-50/30 shadow-sm' : ''} ${isAiRecommending ? 'cursor-pointer' : ''} hover:border-slate-300`}
                        onClick={isAiRecommending ? () => handleAssign(guide.id, aiScore) : undefined}
                      >
                        <CardContent className="p-4 relative overflow-hidden">
                          {isTopAi && (
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center shadow-sm z-10">
                              <Sparkles className="w-3 h-3 mr-1" /> AI BEST
                            </div>
                          )}
                          {overlap && (
                            <div className="absolute top-0 right-0 bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1 text-destructive" /> 일정 겹침
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className={`w-12 h-12 rounded-full ${isTopAi ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-bold text-lg border-2 ${isTopAi ? 'border-indigo-200' : 'border-slate-200'}`}>
                                  {guide.name.substring(0, 1)}
                                </div>
                                {guide.tier === 'Diamond' && <div className="absolute -bottom-1 -right-1 text-xs">💎</div>}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-800">{guide.name}</p>
                                  <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">{guide.tier}</Badge>
                                </div>
                                <div className="flex items-center text-xs font-medium text-slate-500 mt-1 gap-2">
                                  <span className="text-yellow-500 flex items-center">★ {guide.rating}</span>
                                  <span>·</span>
                                  <span>투어 {guide.total_tours}회</span>
                                  <span>·</span>
                                  <span>{guide.languages[0]}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {isAiRecommending ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-2xl font-black text-indigo-600 tracking-tighter">{aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : aiScore}<span className="text-sm font-semibold ml-0.5">%</span></span>
                                  <span className="text-[10px] font-bold text-indigo-400">매칭 점수</span>
                                </div>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant={isSelected ? "default" : "outline"}
                                  disabled={isSelected || assignMutationIsPending}
                                  className={isSelected ? "" : "border-slate-200"}
                                  onClick={(e) => { e.stopPropagation(); handleAssign(guide.id); }}
                                >
                                  {isSelected ? "배정됨" : "선택"}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {/* AI 추천 사유 표시 */}
                          {isAiRecommending && aiResults[guide.id] && !aiLoading && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <p className="text-xs text-slate-600 leading-relaxed">
                                <Sparkles className="w-3 h-3 inline-block mr-1 text-indigo-400" />
                                {aiResults[guide.id].reason}
                              </p>
                              {aiResults[guide.id].strengths.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {aiResults[guide.id].strengths.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">✓ {s}</span>
                                  ))}
                                  {aiResults[guide.id].risks.map((r, i) => (
                                    <span key={i} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full border border-red-200">⚠ {r}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {sortedGuides.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                      활성 상태인 가이드가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          {isLoading ? (
            <Skeleton className="h-[500px] w-full rounded-lg" />
          ) : (
            <AssignmentCalendar
              assignments={filteredAssignments || []}
              onEventClick={(assignment) => setSelectedAssignment(assignment)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

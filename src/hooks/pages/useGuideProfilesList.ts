import { useState } from "react";
import { useGuideProfiles, useCreateGuide, useUpdateGuide } from "@/hooks/use-guides";
import { GuideProfile, GuideProfileFormData } from "@/types/guide";
import { useToast } from "@/components/ui/use-toast";

export const tierColors: Record<string, string> = {
  "Bronze": "bg-amber-700/10 text-amber-700 hover:bg-amber-700/20",
  "Silver": "bg-slate-400/10 text-slate-500 hover:bg-slate-400/20",
  "Gold": "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
  "Platinum": "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20",
  "Diamond": "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20",
};

export function useGuideProfilesList() {
  const { data: guides, isLoading } = useGuideProfiles();
  const createMutation = useCreateGuide();
  const updateMutation = useUpdateGuide();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initData: Partial<GuideProfileFormData> = {
    name: "",
    phone: "",
    languages: [],
    rating: 0,
    tier: "Bronze",
    regions: [],
    specialties: [],
    status: "Active",
  };

  const [formData, setFormData] = useState<Partial<GuideProfileFormData>>(initData);

  const filteredGuides = guides?.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.phone.includes(search)) || [];

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData(initData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (guide: GuideProfile) => {
    setEditingId(guide.id);
    setFormData({
      name: guide.name,
      phone: guide.phone,
      languages: guide.languages || [],
      rating: guide.rating,
      tier: guide.tier,
      regions: guide.regions || [],
      specialties: guide.specialties || [],
      status: guide.status,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast({ title: "수정 완료", description: "가이드 프로필이 수정되었습니다." });
      } else {
        await createMutation.mutateAsync(formData);
        toast({ title: "생성 완료", description: "새로운 가이드가 등록되었습니다." });
      }
      setIsDialogOpen(false);
    } catch (e: any) {
      toast({ title: "오류", description: e.message, variant: "destructive" });
    }
  };

  const toggleStatus = async (guide: GuideProfile) => {
    const newStatus = guide.status === "Active" ? "Inactive" : "Active";
    try {
      await updateMutation.mutateAsync({ id: guide.id, data: { status: newStatus } });
      toast({ title: "상태 변경", description: `${guide.name} 가이드가 ${newStatus} 상태로 변경되었습니다.` });
    } catch (e: any) {
      toast({ title: "상태 변경 실패", description: e.message, variant: "destructive" });
    }
  };

  return {
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
    toggleStatus
  };
}

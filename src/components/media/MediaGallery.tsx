import { useState } from "react";
import { Check, Info } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";

interface MediaItem {
  id: string;
  url: string;
  category: "Hotel" | "Restaurant" | "Vehicle" | "Tour";
  title: string;
  description: string;
}

const mockMedia: MediaItem[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80", category: "Hotel", title: "하차안 웰니스 리조트", description: "5성급 스위트룸 및 수영장" },
  { id: "2", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80", category: "Restaurant", title: "방콕 로컬 크랩다이닝", description: "50명 수용 가능 프라이빗룸 완비" },
  { id: "3", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80", category: "Vehicle", title: "2026년형 45인승 버스", description: "VIP 시트 및 WiFi 제공" },
  { id: "4", url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80", category: "Tour", title: "카오산 로드 인스펙션", description: "저녁 자유일정 추천 구역" },
  { id: "5", url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&q=80", category: "Hotel", title: "다낭 오션뷰 프리미어", description: "단체 조식 연회장 뷰" },
];

export function MediaGallery() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">인스펙션 미디어 자료</h3>
        <span className="text-sm text-muted-foreground">
          {selectedIds.size}개 선택됨
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {mockMedia.map(item => {
          const isSelected = selectedIds.has(item.id);
          return (
            <div 
              key={item.id} 
              className={`relative cursor-pointer group rounded-md overflow-hidden transition-all duration-200 w-24 h-24 sm:w-32 sm:h-32 ${
                isSelected ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-slate-200"
              }`}
              onClick={() => setActiveItem(item)}
            >
              {/* Lazy load simulation */}
              <img 
                src={item.url} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Select Indicator */}
              <div 
                className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center border z-10 transition-colors ${
                  isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-white/80 border-slate-300 text-transparent hover:border-primary"
                }`}
                onClick={(e) => toggleSelect(e, item.id)}
              >
                <Check className="w-3 h-3" />
              </div>
              
              {/* Label overlay overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                <p className="text-[10px] sm:text-xs font-medium text-white line-clamp-1">{item.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Detail Drawer */}
      <Sheet open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {activeItem && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  미디어 상세 정보
                </SheetTitle>
                <SheetDescription>
                  인스펙션 파일에 대한 상세 내역입니다.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6">
                <div className="w-full aspect-video rounded-lg overflow-hidden border">
                  <img src={activeItem.url} alt={activeItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">카테고리</h4>
                    <p className="font-medium mt-1">{activeItem.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">제목</h4>
                    <p className="font-medium mt-1">{activeItem.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">상세 설명</h4>
                    <p className="mt-1 text-sm text-slate-700 leading-relaxed">{activeItem.description}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

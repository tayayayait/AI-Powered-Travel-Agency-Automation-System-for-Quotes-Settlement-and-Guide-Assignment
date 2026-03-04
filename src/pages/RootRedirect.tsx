// src/pages/RootRedirect.tsx
// 데스크톱 → /admin, 모바일 → GuideMain 자동 분기
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RootRedirect() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    // 데스크톱이면 /admin으로 리다이렉트
    if (isMobile === false) {
      navigate("/admin", { replace: true });
    }
  }, [isMobile, navigate]);

  // 모바일이면 null → App.tsx에서 GuideMain을 보여줄 것
  // 데스크톱이면 리다이렉트 중이므로 빈 화면
  if (!isMobile) {
    return null;
  }

  // 모바일일 때만 GuideMain을 동적 import
  return null; // App.tsx에서 처리
}

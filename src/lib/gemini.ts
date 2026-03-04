// src/lib/gemini.ts
// Gemini AI 가이드 매칭 추천 서비스

import { GuideProfile } from "@/types/guide";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GuideMatchRequest {
  assignmentTitle: string;
  clientName: string;
  startDate: string;
  endDate: string;
  region?: string;
  guide: GuideProfile;
}

export interface GuideMatchResult {
  score: number;       // 0~99
  reason: string;      // 추천 사유 (한국어)
  strengths: string[]; // 강점 항목
  risks: string[];     // 위험 요소
}

/**
 * Gemini API를 호출하여 가이드 매칭 점수 + 추천 사유를 반환합니다.
 * API 키가 없으면 fallback(산술적 점수 계산)을 사용합니다.
 */
export async function analyzeGuideMatch(
  request: GuideMatchRequest
): Promise<GuideMatchResult> {
  // Gemini API 키가 없으면 fallback 로직 실행
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
    return fallbackScoring(request);
  }

  try {
    const prompt = buildPrompt(request);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      console.warn("[Gemini] API 호출 실패, fallback 사용:", response.status);
      return fallbackScoring(request);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return fallbackScoring(request);
    }

    const parsed = JSON.parse(text) as Partial<GuideMatchResult>;
    return {
      score: Math.min(99, Math.max(0, parsed.score || 0)),
      reason: parsed.reason || "추천 사유를 생성하지 못했습니다.",
      strengths: parsed.strengths || [],
      risks: parsed.risks || [],
    };
  } catch (err) {
    console.warn("[Gemini] 오류 발생, fallback 사용:", err);
    return fallbackScoring(request);
  }
}

function buildPrompt(req: GuideMatchRequest): string {
  const g = req.guide;
  return `당신은 동남아 여행사의 가이드 배정 전문 AI입니다.
아래 행사 정보와 가이드 프로필을 분석하여 매칭 적합도를 평가해주세요.

## 행사 정보
- 행사명: ${req.assignmentTitle}
- 고객사: ${req.clientName}
- 기간: ${req.startDate} ~ ${req.endDate}

## 가이드 프로필
- 이름: ${g.name}
- 등급: ${g.tier}
- 평점: ${g.rating}/5
- 언어: ${(g.languages || []).join(", ")}
- 담당 지역: ${(g.regions || []).join(", ")}
- 전문 분야: ${(g.specialties || []).join(", ")}
- 누적 투어: ${g.total_tours || 0}회
- 컴플레인: ${g.complaint_count || 0}건
- 쇼핑 매출: ${g.total_shopping_revenue || 0}원
- 옵션 매출: ${g.total_option_revenue || 0}원

## 요구 사항
다음 JSON 형식으로 답변하세요:
{
  "score": <0~99 정수, 매칭 적합도>,
  "reason": "<2~3문장의 종합 추천 사유 (한국어)>",
  "strengths": ["<강점1>", "<강점2>"],
  "risks": ["<위험요소1>"] 또는 빈 배열
}`;
}

/** Gemini API 불가 시 사용하는 경량 점수 산출 */
function fallbackScoring(req: GuideMatchRequest): GuideMatchResult {
  const g = req.guide;
  let score = 65;
  const strengths: string[] = [];
  const risks: string[] = [];

  // 등급 가산
  const tierBonus: Record<string, number> = {
    Diamond: 25, Platinum: 20, Gold: 15, Silver: 10, Bronze: 0,
  };
  score += tierBonus[g.tier] || 0;
  if (g.tier === "Diamond" || g.tier === "Platinum") {
    strengths.push(`${g.tier} 등급 프리미엄 가이드`);
  }

  // 평점 가산
  score += (g.rating || 0) * 2;
  if ((g.rating || 0) >= 4.5) strengths.push(`높은 평점 (${g.rating})`);

  // 컴플레인 감산
  if ((g.complaint_count || 0) > 0) {
    score -= g.complaint_count * 5;
    risks.push(`컴플레인 ${g.complaint_count}건 이력`);
  } else {
    strengths.push("컴플레인 0건 (무결점)");
  }

  // 경험 가산
  if ((g.total_tours || 0) >= 50) {
    score += 5;
    strengths.push(`풍부한 경험 (${g.total_tours}회 투어)`);
  }

  score = Math.min(99, Math.max(10, score));

  const reason = strengths.length > 0
    ? `${g.name} 가이드는 ${strengths[0]}이며, 전반적으로 ${score >= 80 ? "매우 적합" : score >= 60 ? "적합" : "보통"}한 매칭입니다.`
    : `${g.name} 가이드에 대한 매칭 점수: ${score}점`;

  return { score, reason, strengths, risks };
}

/**
 * Gemini API가 사용 가능한지 확인
 */
export function isGeminiAvailable(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.length >= 10;
}

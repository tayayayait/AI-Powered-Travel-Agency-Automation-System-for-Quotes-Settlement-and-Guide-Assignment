// src/lib/i18n.ts
// 경량 i18n 유틸리티 — JSON 기반 다국어 지원

import ko from "@/locales/ko.json";
import th from "@/locales/th.json";
import vi from "@/locales/vi.json";
import lo from "@/locales/lo.json";

export type SupportedLang = "ko" | "th" | "vi" | "lo";

const dictionaries: Record<SupportedLang, Record<string, any>> = { ko, th, vi, lo };

let currentLang: SupportedLang = "ko";

export function setLanguage(lang: SupportedLang) {
  currentLang = lang;
  // html lang 속성도 같이 업데이트
  document.documentElement.lang = lang;
}

export function getLanguage(): SupportedLang {
  return currentLang;
}

/**
 * 번역 키 조회 (dot notation 지원)
 * @example t("common.save") => "저장"
 * @example t("quotation.title") => "견적 관리"
 */
export function t(key: string, lang?: SupportedLang): string {
  const dict = dictionaries[lang || currentLang];
  const keys = key.split(".");
  let value: any = dict;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // fallback to Korean
      let fallback: any = dictionaries.ko;
      for (const fk of keys) {
        if (fallback && typeof fallback === "object" && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return key; // key 자체를 반환
        }
      }
      return typeof fallback === "string" ? fallback : key;
    }
  }

  return typeof value === "string" ? value : key;
}

export const languageLabels: Record<SupportedLang, string> = {
  ko: "한국어",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
  lo: "ພາສາລາວ",
};

import { useEffect, useRef, useState } from "react";

/**
 * 변경된 데이터를 감지하여 지정된 딜레이 이후 자동으로 저장 콜백을 호출하는 훅
 * @param data 감시할 데이터 (Form values 등)
 * @param onSave 저장 수행 함수 (API 호출)
 * @param delay 자동 저장 딜레이 (ms, 기본 2000ms)
 */
export function useAutosave<T>(
  data: T,
  onSave: (data: T) => void,
  delay: number = 2000
) {
  const [isSaving, setIsSaving] = useState(false);
  const prevDataRef = useRef<T>(data);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 최초 렌더링 무시 & 값이 같으면 무시
    if (JSON.stringify(prevDataRef.current) === JSON.stringify(data)) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      // 저장 함수 실행
      Promise.resolve(onSave(data)).finally(() => {
        setIsSaving(false);
        prevDataRef.current = data;
      });
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay]);

  return { isSaving };
}

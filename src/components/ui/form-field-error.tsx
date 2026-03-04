import { AlertCircle } from "lucide-react";

interface FormFieldErrorProps {
  message?: string;
  id?: string;
}

/**
 * 접근성 표준(색+문구+아이콘 병행) 에러 표시 컴포넌트
 */
export function FormFieldError({ message, id }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1.5 text-xs text-destructive mt-1.5"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

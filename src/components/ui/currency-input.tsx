import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  currency?: "KRW" | "THB" | "VND" | "LAK";
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  error?: boolean;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, currency = "THB", value, onChange, error, ...props }, ref) => {
    const formatValue = (val: number | string | undefined) => {
      if (val === undefined || val === null || val === "") return "";
      const num = typeof val === "string" ? parseFloat(val.replace(/[^\d.-]/g, "")) : val;
      if (isNaN(num)) return "";

      const decimals = currency === "THB" ? 2 : 0;
      return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num);
    };

    const [displayValue, setDisplayValue] = React.useState(formatValue(value));

    React.useEffect(() => {
      setDisplayValue(formatValue(value));
    }, [value, currency]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d.-]/g, "");
      const numValue = rawValue ? parseFloat(rawValue) : undefined;
      
      setDisplayValue(formatValue(numValue));
      if (onChange) {
        onChange(numValue);
      }
      
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 숫자입력 허용 패턴 (마이너스 부호, 소수점 포함)
      const rawValue = e.target.value.replace(/[^\d.-]/g, "");
      
      // THB 이외는 소수점 입력 방지
      if (currency !== "THB" && rawValue.includes(".")) {
        return;
      }
      
      setDisplayValue(rawValue);
    };

    return (
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-muted-foreground text-sm font-medium z-10 flex items-center pointer-events-none">
          {currency}
        </div>
        <Input
          type="text"
          className={cn("pl-12 text-right", className)}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };

import { SettlementExpenseItem } from "@/types/settlement";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyCode } from "@/types";

interface Props {
  expenses: SettlementExpenseItem[];
  onChange: (index: number, field: keyof SettlementExpenseItem, value: any) => void;
  readonly?: boolean;
}

export function SettlementExpenseGrid({ expenses, onChange, readonly = false }: Props) {
  if (!expenses || expenses.length === 0) {
    return <div className="text-sm text-muted-foreground p-4 text-center">지출 항목이 없습니다. (견적 연동 오류)</div>;
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>카테고리</TableHead>
            <TableHead>항목 설명</TableHead>
            <TableHead className="text-right">견적 예상액</TableHead>
            <TableHead className="text-right w-32">실제 집행액</TableHead>
            <TableHead className="text-right">차액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense, idx) => {
            const diff = (expense.amountExpected || 0) - (expense.amountActual || 0);
            return (
              <TableRow key={idx}>
                <TableCell className="text-xs text-muted-foreground">{expense.category}</TableCell>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(expense.amountExpected, expense.currency)} {expense.currency}
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    className="h-8 text-right bg-transparent border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
                    placeholder="0"
                    value={expense.amountActual || ""}
                    onChange={(e) => onChange(idx, "amountActual", parseFloat(e.target.value) || 0)}
                    disabled={readonly}
                  />
                </TableCell>
                <TableCell className={`text-right font-medium ${diff < 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(diff, expense.currency)} {expense.currency}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

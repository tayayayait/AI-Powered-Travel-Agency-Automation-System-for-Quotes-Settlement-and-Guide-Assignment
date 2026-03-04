import { UnexpectedExpense } from "@/types/settlement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  expenses: UnexpectedExpense[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof UnexpectedExpense, value: any) => void;
  readonly?: boolean;
}

export function UnexpectedExpensesGrid({ expenses, onAdd, onRemove, onChange, readonly = false }: Props) {
  return (
    <div className="space-y-4 border p-4 rounded-xl mt-4 border-amber-200 bg-amber-50/10">
      <div className="flex justify-between items-center bg-amber-100/30 p-2 rounded-t-lg">
        <h3 className="font-medium text-sm text-amber-800 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" /> 돌발 지출 내역
        </h3>
        {!readonly && (
          <Button variant="outline" size="sm" onClick={onAdd} className="h-8 border-amber-200 text-amber-700 hover:bg-amber-100">
            <Plus className="w-4 h-4 mr-1" /> 돌발 지출 추가
          </Button>
        )}
      </div>

      {expenses && expenses.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-amber-50/50 text-xs text-amber-900 border-amber-200">
              <TableHead>지출 사유 / 상세 내역</TableHead>
              <TableHead className="w-32 text-right">금액(청구액)</TableHead>
              <TableHead className="w-24 text-center">결재 방식</TableHead>
              <TableHead className="w-24 text-center">승인 상태</TableHead>
              {!readonly && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, idx) => {
              // MVP 로직: 50,000 기준
              const isAuto = expense.amount <= 50000;
              const status = isAuto ? "Approved" : expense.status || "Pending";

              return (
                <TableRow key={idx} className="border-amber-100">
                  <TableCell>
                    <Input
                      className="h-8 text-xs px-1 border-amber-200 focus-visible:ring-amber-500"
                      placeholder="사유 (예: 차량 고장으로 인한 추가 식대)"
                      value={expense.description}
                      onChange={(e) => onChange(idx, "description", e.target.value)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="h-8 text-xs text-right px-1 border-amber-200 focus-visible:ring-amber-500"
                      placeholder="0"
                      value={expense.amount || ""}
                      onChange={(e) => onChange(idx, "amount", parseFloat(e.target.value) || 0)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {isAuto ? (
                      <span className="text-success bg-success/10 px-2 py-0.5 rounded-sm">선집행 후보고</span>
                    ) : (
                      <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded-sm">결재 요망</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {status === "Approved" ? (
                      <span className="flex items-center justify-center text-success text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> 승인됨
                      </span>
                    ) : status === "Rejected" ? (
                      <span className="flex items-center justify-center text-destructive text-xs font-medium">
                        <AlertTriangle className="w-3 h-3 mr-1" /> 반려됨
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-muted-foreground text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" /> 대기중
                      </span>
                    )}
                  </TableCell>
                  {!readonly && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => onRemove(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-sm text-center text-muted-foreground p-8">보고된 돌발 지출 내역이 없습니다.</div>
      )}
    </div>
  );
}

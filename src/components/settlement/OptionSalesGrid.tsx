import { OptionSale } from "@/types/settlement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
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
  sales: OptionSale[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof OptionSale, value: any) => void;
  readonly?: boolean;
}

export function OptionSalesGrid({ sales, onAdd, onRemove, onChange, readonly = false }: Props) {
  return (
    <div className="space-y-4 border p-4 rounded-xl mt-4">
      <div className="flex justify-between items-center bg-muted/20 p-2 rounded-t-lg">
        <h3 className="font-medium text-sm text-muted-foreground">옵션(선택관광) 매출 관리</h3>
        {!readonly && (
          <Button variant="outline" size="sm" onClick={onAdd} className="h-8">
            <Plus className="w-4 h-4 mr-1" /> 항목 추가
          </Button>
        )}
      </div>

      {sales && sales.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/10 text-xs">
              <TableHead className="w-32">옵션명</TableHead>
              <TableHead className="w-16 text-center">인원수</TableHead>
              <TableHead className="w-24 text-right">모객 단가</TableHead>
              <TableHead className="w-20 text-center">커미션(%)</TableHead>
              <TableHead className="text-right">가이드 몫</TableHead>
              <TableHead className="text-right">회사 몫</TableHead>
              {!readonly && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, idx) => {
              const totalAmount = sale.quantity * sale.unit_price;
              const commissionAmount = totalAmount * (sale.guide_share_rate / 100);
              const guideShare = commissionAmount; 
              const companyShare = totalAmount - guideShare; 

              return (
                <TableRow key={idx}>
                  <TableCell>
                    <Input
                      className="h-8 text-xs px-1"
                      placeholder="옵션명"
                      value={sale.option_name}
                      onChange={(e) => onChange(idx, "option_name", e.target.value)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="h-8 text-xs text-center px-1"
                      placeholder="0"
                      value={sale.quantity || ""}
                      onChange={(e) => onChange(idx, "quantity", parseFloat(e.target.value) || 0)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="h-8 text-xs text-right px-1"
                      placeholder="0"
                      value={sale.unit_price || ""}
                      onChange={(e) => onChange(idx, "unit_price", parseFloat(e.target.value) || 0)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="h-8 text-xs text-center px-1"
                      placeholder="0"
                      value={sale.guide_share_rate || ""}
                      onChange={(e) => onChange(idx, "guide_share_rate", parseFloat(e.target.value) || 0)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-blue-600">
                    {formatCurrency(guideShare, sale.currency)} {sale.currency}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-primary">
                    {formatCurrency(companyShare, sale.currency)} {sale.currency}
                  </TableCell>
                  {!readonly && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onRemove(idx)}>
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
        <div className="text-sm text-center text-muted-foreground p-8">추가된 옵션 매출 항목이 없습니다.</div>
      )}
    </div>
  );
}

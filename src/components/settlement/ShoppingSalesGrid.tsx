import { ShoppingSale } from "@/types/settlement";
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
  sales: ShoppingSale[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof ShoppingSale, value: any) => void;
  readonly?: boolean;
}

export function ShoppingSalesGrid({ sales, onAdd, onRemove, onChange, readonly = false }: Props) {
  return (
    <div className="space-y-4 border p-4 rounded-xl">
      <div className="flex justify-between items-center bg-muted/20 p-2 rounded-t-lg">
        <h3 className="font-medium text-sm text-muted-foreground">쇼핑 매출 관리</h3>
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
              <TableHead className="w-32">상점명</TableHead>
              <TableHead className="w-28 text-right">매출액</TableHead>
              <TableHead className="w-20 text-center">커미션(%)</TableHead>
              <TableHead className="text-right">가이드 배분분</TableHead>
              <TableHead className="text-right">회사 배분분</TableHead>
              {!readonly && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, idx) => {
              // 컴페니/가이드 배분 로직
              const commissionAmount = sale.sales_amount * (sale.commission_rate / 100);
              const guideShare = commissionAmount * 0.5; // (예상 분배율 50:50)
              const companyShare = commissionAmount * 0.5;

              return (
                <TableRow key={idx}>
                  <TableCell>
                    <Input
                      className="h-8 text-xs px-1"
                      placeholder="상점명"
                      value={sale.shop_name}
                      onChange={(e) => onChange(idx, "shop_name", e.target.value)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="h-8 text-xs text-right px-1"
                      placeholder="0"
                      value={sale.sales_amount || ""}
                      onChange={(e) => onChange(idx, "sales_amount", parseFloat(e.target.value) || 0)}
                      disabled={readonly}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      className="h-8 text-xs text-center px-1"
                      placeholder="0"
                      value={sale.commission_rate || ""}
                      onChange={(e) => onChange(idx, "commission_rate", parseFloat(e.target.value) || 0)}
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
        <div className="text-sm text-center text-muted-foreground p-8">추가된 쇼핑 항목이 없습니다.</div>
      )}
    </div>
  );
}

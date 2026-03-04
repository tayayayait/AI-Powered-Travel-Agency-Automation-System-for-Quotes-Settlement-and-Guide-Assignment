import { useState } from "react";
import { Save, Globe, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    baseCurrency: "KRW",
    language: "ko",
    timezone: "Asia/Seoul",
    rates: {
      THB: 39.5,
      VND: 0.055,
      LAK: 0.062,
    }
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "설정 저장 완료",
        description: "시스템 환경설정이 성공적으로 업데이트되었습니다.",
        variant: "success",
      });
    }, 800);
  };

  const handleRateChange = (currency: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      rates: { ...prev.rates, [currency]: Number(value) }
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">시스템 설정</h1>
        <p className="text-muted-foreground">환율, 언어, 계정 환경 등 통합 시스템을 구성합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 환율 관리 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <CardTitle>환율 관리 (고정 환율)</CardTitle>
            </div>
            <CardDescription>
              견적서 및 정산서 작성 시 기준이 되는 고정 환율입니다. 
              변경 시 <strong className="text-destructive">새롭게 생성되는 견적부터 적용</strong>되며, 
              기존 견적에는 영향을 주지 않습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="w-24 text-right">기준 통화</Label>
              <div className="font-semibold px-3 py-2 bg-slate-100 rounded-md w-full max-w-[200px]">KRW (원)</div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-24 text-right">THB (바트)</Label>
              <div className="relative max-w-[200px] w-full">
                <Input 
                  type="number" 
                  step="0.1" 
                  value={settings.rates.THB}
                  onChange={(e) => handleRateChange('THB', e.target.value)} 
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">원</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-24 text-right">VND (동)</Label>
              <div className="relative max-w-[200px] w-full">
                <Input 
                  type="number" 
                  step="0.001" 
                  value={settings.rates.VND}
                  onChange={(e) => handleRateChange('VND', e.target.value)} 
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">원</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-24 text-right">LAK (킵)</Label>
              <div className="relative max-w-[200px] w-full">
                <Input 
                  type="number" 
                  step="0.001" 
                  value={settings.rates.LAK}
                  onChange={(e) => handleRateChange('LAK', e.target.value)} 
                />
                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">원</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t flex justify-end py-3">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              환율 업데이트 적용
            </Button>
          </CardFooter>
        </Card>

        {/* 언어 및 지역 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">언어 (Language)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={settings.language} 
                onValueChange={(val) => setSettings(prev => ({ ...prev, language: val }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ko" id="ko" />
                  <Label htmlFor="ko">한국어 (Korean)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="th" id="th" />
                  <Label htmlFor="th">ภาษาไทย (Thai)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vi" id="vi" />
                  <Label htmlFor="vi">Tiếng Việt (Vietnamese)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lo" id="lo" />
                  <Label htmlFor="lo">ພາສາລາວ (Lao)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">기본 시간대 생성</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={settings.timezone} 
                onValueChange={(val) => setSettings(prev => ({ ...prev, timezone: val }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Asia/Seoul" id="kr-tz" />
                  <Label htmlFor="kr-tz">KST (서울, +09:00)</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="Asia/Bangkok" id="th-tz" />
                  <Label htmlFor="th-tz">ICT (방콕/비엔티안, +07:00)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Globe, Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { setLanguage, getLanguage, languageLabels, type SupportedLang } from "@/lib/i18n";

export function MobileTopbar() {
  const [lang, setLang] = useState<SupportedLang>(getLanguage());

  const handleLanguageChange = (newLang: SupportedLang) => {
    setLanguage(newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languagechange"));
  };

  return (
    <header className="h-[56px] sticky top-0 z-sticky flex items-center justify-between border-b bg-card px-4 shrink-0 shadow-sm z-50">
      <div className="font-semibold text-primary">TravelApp</div>
      
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-[44px] w-[44px]" aria-label="언어 선택">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.entries(languageLabels) as [SupportedLang, string][]).map(
              ([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleLanguageChange(key)}
                  className="flex items-center justify-between gap-4"
                >
                  <span>{label}</span>
                  {lang === key && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-[44px] w-[44px] relative" aria-label="알림">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  );
}

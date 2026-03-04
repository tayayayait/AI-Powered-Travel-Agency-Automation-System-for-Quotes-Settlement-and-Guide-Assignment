import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Globe, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLanguage, getLanguage, languageLabels, type SupportedLang } from "@/lib/i18n";

export function Topbar() {
  const [lang, setLang] = useState<SupportedLang>(getLanguage());

  const handleLanguageChange = (newLang: SupportedLang) => {
    setLanguage(newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languagechange"));
  };

  return (
    <header
      className="h-[64px] sticky top-0 z-sticky flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur px-6 shrink-0"
      role="banner"
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger aria-label="사이드바 토글" className="text-slate-500 hover:text-slate-900" />
      </div>

      <div className="flex-1 max-w-2xl px-8 ml-4 lg:ml-8 hidden md:block">
        <label className="relative flex items-center group">
          <Search className="absolute left-4 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full pl-11 pr-4 py-2.5 bg-card border border-border/80 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm placeholder:text-slate-400" 
            placeholder="Search operations, quotes, guides..." 
            type="text"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        {/* 언어 선택 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-full"
            >
              <Globe className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">현재 언어: {languageLabels[lang]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-border/50">
            {(Object.entries(languageLabels) as [SupportedLang, string][]).map(
              ([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleLanguageChange(key)}
                  className="flex items-center justify-between gap-4 py-2 cursor-pointer rounded-lg"
                >
                  <span className="text-sm font-medium">{label}</span>
                  {lang === key && (
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 알림 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-full"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span
            className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"
          />
        </Button>

        {/* 사용자 아바타 */}
        <div className="flex items-center gap-2 ml-2">
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <img 
              alt="User Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsr9-Q-llQxVaUmyvyVaw7e_M4ZbwcjE814hiJxoIh1ONDmhEK7EINsxXLGkxaXlGyePCJOSFzaonUJpkngpBuxQKRcSNxC5LiD9nVk5_YlachTtUnw18marly1KNFaIc5o_UU3hsmLN2no8UPS74KhWcESMYU8qUTheRCZFZ_iVyOvlHxoIgR61pLPGGXEHNvT-bmLovz302epvx9OAjcL1th8zkskkSDWYPBTGlE33iKqLcYRb1osFUrA1TBZ68LS1n-c3WPTG3b"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "24px", /* 데스크탑 기본 */
      screens: {
        "2xl": "1440px", /* container.max */
      },
    },
    screens: {
      'xs': '360px',   /* 모바일 폼 최저 */
      'sm': '480px',   /* 큰 모바일 */
      'md': '768px',   /* 태블릿 */
      'lg': '1024px',  /* PC 사이드바 시작 */
      'xl': '1280px',  /* 와이드 */
      '2xl': '1440px', /* 최대 */
    },
    extend: {
      spacing: {
        '0': '0px',
        '1': '4px',    /* space.1 (아이콘-텍스트) */
        '2': '8px',    /* space.2 (폼 요소 내부) */
        '3': '12px',   /* space.3 (버튼 그룹/필터) */
        '4': '16px',   /* space.4 (카드 패딩 기본) */
        '5': '20px',   /* space.5 (넓은 패딩, 태블릿 패딩) */
        '6': '24px',   /* space.6 (페이지 패딩 PC) */
        '8': '32px',   /* space.8 (섹션 분리) */
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          strong: "hsl(var(--border-strong))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        overlay: "hsl(var(--overlay) / 0.5)", /* #0F172A80 (50% opacity 투명도 고정) */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        /* 우선순위: KR/Thai/Lao/Viet Noto Sans -> System */
        sans: ['"Noto Sans KR"', '"Noto Sans Thai"', '"Noto Sans Lao"', '"Noto Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        pill: "var(--radius-pill)",
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        none: '0px 0px 0px 0px transparent',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      zIndex: {
        base: '0',
        sticky: '10',
        dropdown: '20',
        overlay: '30',
        modal: '40',
        toast: '50',
      },
      transitionDuration: {
        fast: '150ms', /* 마이크로 인터랙션 */
        base: '200ms', /* 모달/토스트 기본 */
        slow: '300ms', /* 드로어 작동 */
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2,0,0,1)', /* 가속-감속 표준 */
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "skeleton-shimmer": {
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "skeleton-loop": "skeleton-shimmer 1500ms infinite cubic-bezier(0.2,0,0,1)", /* 상세서 1-6 기반 */
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

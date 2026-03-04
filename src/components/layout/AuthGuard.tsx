import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

const isDev = import.meta.env.DEV;

export function AuthGuard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!isDev);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 개발 모드: 인증 체크 건너뜀
    if (isDev) return;

    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);

          if (!session?.user && location.pathname !== "/login") {
            navigate("/login", {
              replace: true,
              state: { from: location.pathname },
            });
          }
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
          navigate("/login", { replace: true });
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/login", { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // 개발 모드: 인증 우회 → 바로 Outlet 렌더링
  if (isDev) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}

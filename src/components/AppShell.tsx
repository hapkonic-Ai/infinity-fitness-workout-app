import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Home,
  Languages,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { useLanguage, useT } from "@/lib/i18n/use-language";
import { LANGS, LANG_LABEL } from "@/lib/i18n/static";

const tabs = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/workouts", key: "nav.workouts", icon: Dumbbell },
  { to: "/profile", key: "nav.profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/exercises/");
  const t = useT();
  const { lang, setLang } = useLanguage();

  const cycleLang = () => {
    const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
    setLang(next);
  };

  return (
    <div className="min-h-dvh bg-background md:flex md:justify-center">
      <div className="w-full md:max-w-md md:border-x md:border-border min-h-dvh flex flex-col relative">
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl leading-none tracking-wide">
              INFINITY<span className="text-primary">FITNESS</span>
            </p>
          </div>
          <button
            onClick={cycleLang}
            aria-label="Switch language"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Languages className="h-3.5 w-3.5" />
            {LANG_LABEL[lang]}
          </button>
        </header>

        <main className="flex-1 pb-24">{children}</main>

        {!isDetail && (
          <nav className="fixed bottom-0 inset-x-0 z-20 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-card/95 backdrop-blur border-t border-border">
            <div className="grid grid-cols-3">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  <tab.icon className="h-5 w-5" strokeWidth={2} />
                  {t(tab.key)}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

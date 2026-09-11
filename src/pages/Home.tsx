import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/lib/i18n/use-language";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user } = useAuth();
  const t = useT();
  const firstName = user?.name?.split(" ")[0] ?? "Athlete";

  const schedule = [
    { day: t("day.mon"), focus: t("sched.chestTriceps") },
    { day: t("day.tue"), focus: t("sched.backBiceps") },
    { day: t("day.wed"), focus: t("sched.shoulders") },
    { day: t("day.thu"), focus: t("sched.legsAbs") },
    { day: t("day.fri"), focus: t("sched.cardio") },
    { day: t("day.sat"), focus: t("sched.circuit") },
  ];

  // Today's name in the current language, computed from the device clock.
  const weekDayKeys = [
    "day.sun",
    "day.mon",
    "day.tue",
    "day.wed",
    "day.thu",
    "day.fri",
    "day.sat",
  ] as const;
  const todayName = t(weekDayKeys[new Date().getDay()]);

  return (
    <div className="px-5 pt-6 space-y-8">
      <section className="animate-fade-up">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("home.eyebrow")}
        </p>
        <h1 className="font-display text-6xl leading-[0.95] tracking-wide mt-2">
          {t("home.trainHard")}
          <br />
          <span className="text-primary">{firstName.toUpperCase()}.</span>
        </h1>
      </section>

      <section className="animate-fade-up" style={{ animationDelay: "0.08s" }}>
        <h2 className="font-display text-2xl tracking-wide mb-3">
          {t("home.weeklySchedule")}
        </h2>
        <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
          {schedule.map((s, i) => {
            const isToday = s.day === todayName;
            return (
              <div
                key={s.day}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 animate-fade-up",
                  isToday && "bg-primary/10",
                )}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span
                  className={cn(
                    "font-display text-lg w-12 leading-none",
                    isToday ? "text-primary" : "text-foreground/30",
                  )}
                >
                  {s.day.slice(0, 3).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium text-sm",
                      isToday && "text-primary",
                    )}
                  >
                    {s.focus}
                  </p>
                </div>
                {isToday && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary border border-primary/40 rounded-full px-2 py-0.5">
                    {t("home.today")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {t("home.restDayNote")}
        </p>
      </section>
    </div>
  );
}

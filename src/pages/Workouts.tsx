import { useSearchParams } from "react-router";
import { Repeat } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { ExerciseRow } from "@/components/cards";
import { WarningBanner } from "@/components/WarningBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GROUP_ORDER, todaysGroups } from "@/const";
import { useLanguage, useT } from "@/lib/i18n/use-language";
import { groupLabel } from "@/lib/i18n/static";
import { translateExercise } from "@/lib/i18n/exercises";

export default function WorkoutsPage() {
  const exercisesQuery = trpc.content.exercises.list.useQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = useT();
  const { lang } = useLanguage();
  const activeGroup = searchParams.get("group");

  const exercises = (exercisesQuery.data ?? []).map((e) =>
    translateExercise(e, lang),
  );
  const today = todaysGroups();
  const isCircuitDay = new Date().getDay() === 6;
  const groups = GROUP_ORDER.filter((g) =>
    exercises.some((e) => e.muscleGroup === g),
  ).sort((a, b) => Number(!today.includes(a)) - Number(!today.includes(b)));
  const visibleGroups = activeGroup
    ? groups.filter((g) => g === activeGroup)
    : groups;

  return (
    <div className="px-5 pt-6">
      <h1 className="font-display text-5xl tracking-wide mb-1">WORKOUTS</h1>
      <p className="text-sm text-muted-foreground mb-5">
        {t("workouts.blurb")}
      </p>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 mb-3">
        <button
          onClick={() => setSearchParams({})}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors",
            !activeGroup
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary",
          )}
        >
          {t("workouts.all")}
        </button>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setSearchParams({ group: g })}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors",
              activeGroup === g
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary",
            )}
          >
            {today.includes(g) && (
              <span
                className={cn(
                  "mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",
                  activeGroup === g ? "bg-primary-foreground" : "bg-primary",
                )}
              />
            )}
            {groupLabel(lang, g)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <WarningBanner />

        {exercisesQuery.isLoading &&
          [0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}

        {isCircuitDay && (
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-3">
              {t("workouts.circuitTitle")}
              <span className="ml-2 align-middle font-sans text-[10px] font-bold tracking-[0.25em] text-primary">
                {t("workouts.today").toUpperCase()}
              </span>
            </h2>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Repeat className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-foreground/85">
                {t("workouts.circuitText")}
              </p>
            </div>
          </section>
        )}

        {visibleGroups.map((group) => {
          const rows = exercises.filter((e) => e.muscleGroup === group);
          const isToday = today.includes(group);
          return (
            <section key={group}>
              <h2 className="font-display text-2xl tracking-wide mb-3">
                {groupLabel(lang, group).toUpperCase()}
                {isToday && (
                  <span className="ml-2 align-middle font-sans text-[10px] font-bold tracking-[0.25em] text-primary">
                    {t("workouts.today").toUpperCase()}
                  </span>
                )}
              </h2>
              <div className="space-y-2">
                {rows.map((e, i) => (
                  <ExerciseRow key={e.id} exercise={e} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        {!isCircuitDay && (
          <section>
            <h2 className="font-display text-2xl tracking-wide mb-3">
              {t("workouts.circuitTitle")}
            </h2>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Repeat className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-foreground/85">
                {t("workouts.circuitText")}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

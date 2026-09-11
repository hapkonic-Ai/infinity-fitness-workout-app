import type { Exercise } from "@db/schema";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "@/lib/i18n/use-language";
import { groupLabel } from "@/lib/i18n/static";

const difficultyStyle: Record<string, string> = {
  beginner: "text-primary border-primary/40",
  intermediate: "text-red-300 border-red-300/40",
  advanced: "text-red-400 border-red-400/40",
};

export function DifficultyBadge({ level }: { level: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-semibold uppercase tracking-widest border rounded-full px-2 py-0.5",
        difficultyStyle[level] ?? difficultyStyle.beginner,
      )}
    >
      {level}
    </span>
  );
}

export function ExerciseRow({
  exercise,
  index = 0,
  selected,
  onSelect,
}: {
  exercise: Exercise;
  index?: number;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { lang } = useLanguage();
  return (
    <div
      className={cn(
        "rounded-xl border bg-card px-4 py-4 animate-fade-up",
        selected ? "border-primary" : "border-border",
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-4">
        {onSelect && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onSelect();
            }}
            aria-label={selected ? "Remove from selection" : "Select exercise"}
            className={cn(
              "h-5 w-5 shrink-0 rounded-md border transition-colors",
              selected
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary",
            )}
          >
            {selected && <Check className="h-4 w-4" />}
          </button>
        )}
        <span className="font-display text-2xl w-8 text-foreground/25">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Link to={`/exercises/${exercise.id}`} className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{exercise.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {exercise.muscleGroup ? groupLabel(lang, exercise.muscleGroup) : ""}
            {exercise.sets ? ` · ${exercise.sets} sets` : ""}
            {exercise.reps ? ` × ${exercise.reps}` : ""}
            {exercise.durationSec
              ? ` · ${Math.round(exercise.durationSec / 60) || exercise.durationSec + "s"} min`
              : ""}
          </p>
        </Link>
        <DifficultyBadge level={exercise.difficulty} />
      </div>
    </div>
  );
}

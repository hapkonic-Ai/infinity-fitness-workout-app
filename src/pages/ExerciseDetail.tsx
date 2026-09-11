import { useParams, Link } from "react-router";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { DifficultyBadge } from "@/components/cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useT, useLanguage } from "@/lib/i18n/use-language";
import { groupLabel } from "@/lib/i18n/static";
import { translateExercise } from "@/lib/i18n/exercises";
import { exerciseImages } from "@/lib/exercise-images";
import { exerciseGif } from "@/lib/exercise-gifs";

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const exerciseId = Number(id);
  const exercisesQuery = trpc.content.exercises.list.useQuery();
  const t = useT();
  const { lang } = useLanguage();

  const exercise = (exercisesQuery.data ?? [])
    .map((e) => translateExercise(e, lang))
    .find((e) => e.id === exerciseId);

  if (exercisesQuery.isLoading) {
    return (
      <div className="px-5 pt-6 space-y-4">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="px-5 pt-6">
        <p className="text-sm text-muted-foreground">{t("detail.notFound")}</p>
        <Link
          to="/workouts"
          className="inline-block mt-4 text-sm text-primary font-medium"
        >
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  const instructions = parseList(exercise.instructions);
  const mistakes = parseList(exercise.mistakes);
  const images = exerciseImages(exercise.name);
  const gif = exerciseGif(exercise.name);

  return (
    <div className="px-5 pt-6 pb-4 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/workouts" aria-label="Back to exercises">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-3xl leading-none tracking-wide">
            {exercise.name.toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {exercise.muscleGroup ? groupLabel(lang, exercise.muscleGroup) : ""}
            {exercise.sets ? ` · ${exercise.sets} sets` : ""}
            {exercise.reps ? ` × ${exercise.reps}` : ""}
            {exercise.durationSec
              ? ` · ${Math.round(exercise.durationSec / 60) || exercise.durationSec + "s"} min`
              : ""}
          </p>
        </div>
        <DifficultyBadge level={exercise.difficulty} />
      </div>

      {gif && (
        <section>
          <h2 className="font-display text-2xl tracking-wide mb-3">
            {t("detail.motion")}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={gif}
              alt={`${exercise.name} animated demo`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {images && (
        <section>
          <h2 className="font-display text-2xl tracking-wide mb-3">
            {t("detail.form")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {images.map((src, i) => (
              <figure key={src}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={src}
                    alt={`${exercise.name} — ${i === 0 ? t("detail.start") : t("detail.finish")}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-1.5 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {i === 0 ? t("detail.start") : t("detail.finish")}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {exercise.description && (
        <p className="text-sm text-muted-foreground leading-relaxed -mt-2">
          {exercise.description}
        </p>
      )}

      <section>
        <h2 className="font-display text-2xl tracking-wide mb-3">
          {t("detail.howTo")}
        </h2>
        <ol className="space-y-2.5">
          {instructions.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span className="font-display text-xl text-primary leading-none w-7 shrink-0 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-wide mb-3">
          {t("detail.notTo")}
        </h2>
        <ul className="space-y-2.5">
          {mistakes.map((m, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{m}</p>
            </li>
          ))}
        </ul>
      </section>

      {instructions.length > 0 && (
        <p className="text-xs text-muted-foreground flex items-start gap-2 pt-1">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          {t("detail.tip")}
        </p>
      )}
    </div>
  );
}

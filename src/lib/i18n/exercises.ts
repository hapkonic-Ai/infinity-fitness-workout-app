import { EX_HI_CHUNK1 } from "./gen/hi.chunk1";
import { EX_HI_CHUNK2 } from "./gen/hi.chunk2";
import { EX_HI_CHUNK3 } from "./gen/hi.chunk3";
import { EX_HI_CHUNK4 } from "./gen/hi.chunk4";
import { EX_HI_CHUNK5 } from "./gen/hi.chunk5";
import { EX_TA_CHUNK1 } from "./gen/ta.chunk1";
import { EX_TA_CHUNK2 } from "./gen/ta.chunk2";
import { EX_TA_CHUNK3 } from "./gen/ta.chunk3";
import { EX_TA_CHUNK4 } from "./gen/ta.chunk4";
import { EX_TA_CHUNK5 } from "./gen/ta.chunk5";

export type ExerciseTranslation = {
  name: string;
  description: string;
  instructions: string[];
  mistakes: string[];
};

export const EXERCISES_HI: Record<string, ExerciseTranslation> = {
  ...EX_HI_CHUNK1,
  ...EX_HI_CHUNK2,
  ...EX_HI_CHUNK3,
  ...EX_HI_CHUNK4,
  ...EX_HI_CHUNK5,
};

export const EXERCISES_TA: Record<string, ExerciseTranslation> = {
  ...EX_TA_CHUNK1,
  ...EX_TA_CHUNK2,
  ...EX_TA_CHUNK3,
  ...EX_TA_CHUNK4,
  ...EX_TA_CHUNK5,
};

type TranslatableExercise = {
  name: string;
  description: string | null;
  instructions: string | null;
  mistakes: string | null;
};

/** Returns the exercise with its content in the selected language. */
export function translateExercise<T extends TranslatableExercise>(
  exercise: T,
  lang: "en" | "hi" | "ta",
): T {
  if (lang === "en") return exercise;
  const dict = lang === "hi" ? EXERCISES_HI : EXERCISES_TA;
  const hit = dict[exercise.name];
  if (!hit) return exercise;
  return {
    ...exercise,
    name: hit.name,
    description: hit.description,
    instructions: JSON.stringify(hit.instructions),
    mistakes: JSON.stringify(hit.mistakes),
  };
}

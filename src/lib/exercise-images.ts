// Maps Infinity Fitness exercise names to entries in the public-domain
// free-exercise-db dataset (yuhonas/free-exercise-db). Each entry has two
// step photos served from the repo's GitHub raw CDN.
const EXERCISE_DB_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

const EXERCISE_DB_IDS: Record<string, string> = {
  "Ab Crunch Machine": "Ab_Crunch_Machine",
  "Air Bike": "Air_Bike",
  "Arnold Press": "Kettlebell_Arnold_Press",
  "Barbell Bent-Over Row": "Bent_Over_Barbell_Row",
  "Barbell Preacher Curl": "Preacher_Curl",
  "Barbell Squat": "Barbell_Squat",
  "Battle Ropes": "Battling_Ropes",
  "Bench Dips": "Bench_Dips",
  "Cable Crossover": "Cable_Crossover",
  "Cable Crunch": "Cable_Crunch",
  "Cable Curl": "High_Cable_Curls",
  "Cable Drag Curl": "Drag_Curl",
  "Cable Face Pull": "Face_Pull",
  "Cable Pullover": "Rope_Straight-Arm_Pulldown",
  "Cable Upright Row": "Upright_Cable_Row",
  "Calf Raise Machine": "Standing_Calf_Raises",
  "Close-Grip Bench Press": "Smith_Machine_Close-Grip_Bench_Press",
  "Concentration Curl": "Concentration_Curls",
  "Crunches": "Crunches",
  "Deadlift": "Axle_Deadlift",
  "Diamond Push-Ups": "Pushups",
  "Dumbbell Lateral Raise": "Side_Lateral_Raise",
  "Dumbbell Pullover": "Bent-Arm_Dumbbell_Pullover",
  "Dumbbell Row": "Bent_Over_Two-Dumbbell_Row",
  "Dumbbell Tricep Kickback": "Tricep_Dumbbell_Kickback",
  "EZ Bar Curl": "EZ-Bar_Curl",
  "Flat Dumbbell Press": "Dumbbell_Bench_Press",
  "Forearm Curl": "Cable_Wrist_Curl",
  "Front Raise": "Front_Raise_And_Pullover",
  "Glute Bridge": "Barbell_Glute_Bridge",
  "Hack Squat": "Hack_Squat",
  "Hanging Leg Raise": "Hanging_Leg_Raise",
  "Hip Abductor/Adductor": "Adductor",
  "Incline Dumbbell Curl": "Incline_Dumbbell_Curl",
  "Incline Dumbbell Fly": "Incline_Dumbbell_Flyes",
  "Incline Dumbbell Press": "Incline_Dumbbell_Press",
  "Jump Rope": "Rope_Jumping",
  "Jump Squats": "Freehand_Jump_Squat",
  "Jumping Jacks": "Star_Jump",
  "Lat Pulldown": "Close-Grip_Front_Lat_Pulldown",
  "Leg Curl": "Ball_Leg_Curl",
  "Leg Extension": "Leg_Extensions",
  "Leg Press": "Leg_Press",
  "Lunges": "Dumbbell_Lunges",
  "Machine Preacher Curl": "Machine_Preacher_Curls",
  "Machine Row": "Seated_Cable_Rows",
  "Mountain Climbers": "Mountain_Climbers",
  "Oblique Cable Crunch": "Cable_Crunch",
  "One-Arm Cable Triceps Extension": "Cable_One_Arm_Tricep_Extension",
  "One-Arm Standing Dumbbell Extension": "Dumbbell_One-Arm_Triceps_Extension",
  "Overhead Triceps Extension": "Cable_Rope_Overhead_Triceps_Extension",
  "Pec Deck Fly": "Butterfly",
  "Plank": "Plank",
  "Push-Ups": "Pushups",
  "Reverse Pec Fly": "Reverse_Machine_Flyes",
  "Roman Chair Twisting Knee Raise": "Knee_Hip_Raise_On_Parallel_Bars",
  "Romanian Deadlift": "Romanian_Deadlift",
  "Russian Twist": "Russian_Twist",
  "Seated Cable Row": "Seated_Cable_Rows",
  "Seated Dumbbell Triceps Extension": "Seated_Triceps_Press",
  "Shoulder Press": "Alternating_Cable_Shoulder_Press",
  "Skullcrusher": "Band_Skull_Crusher",
  "Standing Barbell Curl": "Barbell_Curl",
  "Standing Dumbbell Curl": "Dumbbell_Bicep_Curl",
  "Standing Hammer Curl": "Hammer_Curls",
  "Standing High Pulley Cable Curl": "High_Cable_Curls",
  "Sumo Dumbbell Squat": "Dumbbell_Squat",
  "T-Bar Row": "Lying_T-Bar_Row",
  "Tricep Dip": "Dips_-_Triceps_Version"
};

/** Start/end position photo URLs for an exercise, or null when the
 *  public database has no equivalent (photos are simply not shown). */
export function exerciseImages(name: string): [string, string] | null {
  const id = EXERCISE_DB_IDS[name];
  if (!id) return null;
  return [
    `${EXERCISE_DB_BASE}/${id}/0.jpg`,
    `${EXERCISE_DB_BASE}/${id}/1.jpg`,
  ];
}

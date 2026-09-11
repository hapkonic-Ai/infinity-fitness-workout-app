import { getDb } from "../api/queries/connection";
import { gyms, exercises } from "./schema";

// Every video is Muscle & Strength content — form guides from the M&S
// YouTube channel (@muscleandstrength) and their exercise database
// (muscleandstrength.com/exercises).
const ms = (id: string) => `https://www.youtube.com/embed/${id}`;
const yt = ms;
const steps = (...s: string[]) => JSON.stringify(s);
const donts = (...s: string[]) => JSON.stringify(s);

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // --- Demo gym branch (editable from the admin panel) ---------------------
  const existingGyms = await db.query.gyms.findMany();
  if (existingGyms.length === 0) {
    await db.insert(gyms).values({
      name: "Infinity Fitness — Flagship",
      address: "Demo branch — update coordinates in the admin panel",
      latitude: 12.9716,
      longitude: 80.2431,
      radiusMeters: 100,
      active: true,
    });
    console.log("Seeded demo gym.");
  }

  // --- Exercise library, grouped by muscle ----------------------------------
  const existingExercises = await db.query.exercises.findMany();
  if (existingExercises.length === 0) {
    const exerciseRows: (typeof exercises.$inferInsert)[] = [
      // ------------------------------------------------------------------ CHEST
      {
        name: "Push-Ups",
        category: "strength",
        muscleGroup: "Chest",
        description: "The classic bodyweight press — chest, shoulders and triceps with zero equipment.",
        videoUrl: yt("fWDRGdvctrQ"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Place your hands slightly wider than shoulder-width, fingers pointing forward.",
          "Set your body in a straight line from head to heels — squeeze your glutes and brace your core.",
          "Lower your chest to an inch off the floor, elbows at roughly 45 degrees from your torso.",
          "Push the floor away without letting your hips sag and lock out at the top.",
          "Inhale on the way down, exhale as you press."
        ),
        mistakes: donts(
          "Letting the hips sag or stick up — keep one rigid line from head to heels.",
          "Flaring the elbows straight out to 90 degrees — this irritates the shoulders.",
          "Shortening the range — your chest should nearly touch the floor every rep.",
          "Craning the neck up — keep your eyes on the floor just ahead of your hands."
        ),
      },
      {
        name: "Pec Deck Fly",
        category: "strength",
        muscleGroup: "Chest",
        description: "Machine fly that isolates the chest with constant tension and a safe fixed path.",
        videoUrl: yt("wr8OCIugQSU"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set the seat so the machine handles line up with the middle of your chest.",
          "Press your back and head against the pads, feet flat on the floor.",
          "Grab the handles with a neutral grip and keep a soft bend in your elbows — hold that angle.",
          "Sweep the handles together in a wide arc until they nearly touch in front of your chest.",
          "Squeeze the chest for a beat, then return slowly until you feel a deep stretch."
        ),
        mistakes: donts(
          "Straightening the arms fully — the elbow bend must stay fixed to protect the joint.",
          "Bouncing out of the stretch at the bottom — control the return for 2-3 seconds.",
          "Rounding the shoulders forward — keep your chest tall and shoulder blades back.",
          "Using too much weight and turning the fly into a press."
        ),
      },
      {
        name: "Flat Dumbbell Press",
        category: "strength",
        muscleGroup: "Chest",
        description: "Dumbbell bench press on a flat bench — a bigger range of motion than the barbell version.",
        videoUrl: yt("ZzFblmTUxYU"),
        difficulty: "intermediate",
        sets: 4,
        reps: "8-10",
        instructions: steps(
          "Sit on the flat bench with the dumbbells resting on your thighs, then kick them up as you lie back.",
          "Plant your feet, set your shoulder blades down and back, and keep a small arch in the upper back.",
          "Start with the dumbbells over your chest, palms forward, wrists stacked over the elbows.",
          "Lower the dumbbells out and down until they reach chest level, forearms vertical at the bottom.",
          "Press up and slightly in so the dumbbells meet over your sternum — don't let them clank."
        ),
        mistakes: donts(
          "Dropping the dumbbells too far out toward the shoulders — keep them above the elbows.",
          "Bouncing the dumbbells off your chest at the bottom.",
          "Lifting your hips off the bench to drive the weight up.",
          "Letting the wrists bend back under the load — keep them stacked and neutral."
        ),
      },
      {
        name: "Incline Dumbbell Press",
        category: "strength",
        muscleGroup: "Chest",
        description: "Pressing on a 30-45 degree incline to target the upper chest.",
        videoUrl: yt("u69PdOXI9QA"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10",
        instructions: steps(
          "Set the bench to 30-45 degrees and sit back with the dumbbells at shoulder height.",
          "Brace your feet and pin your shoulder blades into the bench.",
          "Press the dumbbells up and slightly back so they track over your upper chest.",
          "Lower under control until the handles reach shoulder level, feeling the stretch in the upper pecs.",
          "Drive up explosively, squeezing the upper chest at the top without clanking the weights."
        ),
        mistakes: donts(
          "Setting the bench too steep — past 45 degrees it becomes mostly a shoulder exercise.",
          "Letting the dumbbells drift forward over the face instead of over the upper chest.",
          "Half-repping — bring the dumbbells down to at least shoulder level every rep.",
          "Over-arching the lower back to cheat the weight up."
        ),
      },
      {
        name: "Incline Dumbbell Fly",
        category: "strength",
        muscleGroup: "Chest",
        description: "Fly on an incline for upper-chest stretch and isolation.",
        videoUrl: yt("T68gk3eubk0"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set the bench to about 30 degrees and lie back holding the dumbbells above your upper chest.",
          "Keep a fixed soft bend in the elbows — imagine hugging a wide barrel.",
          "Open your arms in a wide arc, lowering the dumbbells until you feel a deep chest stretch.",
          "Reverse the arc, squeezing the chest to bring the dumbbells back over the upper chest.",
          "Keep the shoulder blades pinned down and back the whole set."
        ),
        mistakes: donts(
          "Turning the fly into a press by bending and straightening the elbows.",
          "Lowering the dumbbells past a comfortable stretch or below shoulder level.",
          "Letting the shoulders roll forward at the bottom — keep the blades retracted.",
          "Going too heavy — flys reward control, not load."
        ),
      },
      {
        name: "Cable Crossover",
        category: "strength",
        muscleGroup: "Chest",
        description: "Cable fly with constant tension — set the pulleys high-to-low or low-to-high to bias upper or lower chest.",
        videoUrl: yt("qo0CD4QJtkA"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Set both pulleys slightly above shoulder height and take a handle in each hand.",
          "Step one foot forward, lean your torso slightly forward, and hold the handles out wide.",
          "Keep a soft bend in the elbows and sweep the handles down and together in front of your hips.",
          "Cross the handles slightly at full contraction and squeeze the chest for a second.",
          "Return slowly, letting the chest stretch wide without letting the stacks slam."
        ),
        mistakes: donts(
          "Bending the elbows more as you pull — the arm angle must stay fixed.",
          "Using a bounce or body swing to bring the handles together.",
          "Letting the weight stack drop and yank your shoulders at the end of the rep.",
          "Standing fully upright with no forward lean — you lose chest tension and load the front delts."
        ),
      },
      {
        name: "Dumbbell Pullover",
        category: "strength",
        muscleGroup: "Chest",
        description: "Cross-bench pullover stretching the chest and lats through a long range.",
        videoUrl: yt("QgN_xgPCRnc"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Lie across a flat bench so only your upper back is supported, hips lower than the bench.",
          "Hold one dumbbell with both hands above your chest, palms against the inner plate.",
          "Keeping a slight elbow bend, lower the dumbbell behind your head in a big arc.",
          "Go as deep as your shoulders comfortably allow and feel the stretch through the chest and lats.",
          "Pull the dumbbell back over your chest using the chest and lats, not the arms."
        ),
        mistakes: donts(
          "Bending the elbows into a curl — keep the arm angle nearly constant.",
          "Letting the hips drop or bounce for momentum.",
          "Lowering deeper than your shoulder mobility allows.",
          "Turning it into a triceps skullcrusher by bending at the elbow on the way up."
        ),
      },

      // ------------------------------------------------------------------ LATS
      {
        name: "Lat Pulldown",
        category: "strength",
        muscleGroup: "Lats",
        description: "Vertical pull for width — use a close neutral grip to bias the lower lats.",
        videoUrl: yt("U5YWNF3675Q"),
        difficulty: "beginner",
        sets: 4,
        reps: "10-12",
        instructions: steps(
          "Sit at the station with the pads snug on your thighs and feet flat on the floor.",
          "Grab the bar with a grip slightly wider than your shoulders — or use the close neutral handle for lower-lat bias.",
          "Lean back slightly, chest up, and pull the bar down to your collarbone.",
          "Drive the elbows down and in, squeezing the lats at the bottom.",
          "Return slowly until the arms are fully extended without letting the stack slam."
        ),
        mistakes: donts(
          "Pulling behind the neck — it adds no benefit and strains the shoulders.",
          "Swinging your torso to yank the weight down.",
          "Pulling the bar to the chest with the arms instead of driving the elbows down.",
          "Cutting the stretch short at the top — let the lats open fully."
        ),
      },
      {
        name: "Seated Cable Row",
        category: "strength",
        muscleGroup: "Lats",
        description: "Horizontal cable pull for mid-back thickness.",
        videoUrl: yt("glPj6QShCVQ"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Sit tall on the bench, knees slightly bent, and grab the handle with both hands.",
          "Brace your core and keep your chest up — shoulders down and back.",
          "Pull the handle to your navel, driving the elbows back past your torso.",
          "Squeeze the shoulder blades together for a beat at the end.",
          "Return under control, letting the back stretch forward without rounding."
        ),
        mistakes: donts(
          "Rocking the torso back and forth to move the weight.",
          "Shrugging the shoulders up toward the ears.",
          "Pulling with bent wrists and curled hands — the arms are hooks, the back pulls.",
          "Rounding the spine at the end of the return."
        ),
      },
      {
        name: "T-Bar Row",
        category: "strength",
        muscleGroup: "Lats",
        description: "Chest-supported row on the T-bar — heavy mid-back work with a fixed path.",
        videoUrl: yt("pF5E966XrfA"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10",
        instructions: steps(
          "Straddle the bar and set the chest pad so your hands reach the handles with arms extended.",
          "Plant your feet, press your chest into the pad, and grab the handles.",
          "Pull the bar up to the pad, driving the elbows back and squeezing the shoulder blades.",
          "Pause briefly at the top, then lower until the arms are straight.",
          "Keep your head neutral and neck in line with your spine."
        ),
        mistakes: donts(
          "Bouncing the weight off the bottom with a stretched-chest rebound.",
          "Lifting the chest off the pad to cheat the range.",
          "Yanking with the arms before the back engages.",
          "Letting the plates crash between reps."
        ),
      },
      {
        name: "Barbell Bent-Over Row",
        category: "strength",
        muscleGroup: "Lats",
        description: "The mass-building horizontal row — hinge and pull in one demanding movement.",
        videoUrl: yt("BRkIAt4RdpU"),
        difficulty: "intermediate",
        sets: 4,
        reps: "8-10",
        instructions: steps(
          "Hinge at the hips until your torso is around 45 degrees, knees soft, back flat.",
          "Grip the bar just outside shoulder width with straight wrists.",
          "Brace hard and pull the bar to your lower ribs, elbows tracking back.",
          "Squeeze the shoulder blades at the top, then lower with control.",
          "Keep the same hip angle for the entire set — no standing up between reps."
        ),
        mistakes: donts(
          "Rounding the lower back under load — drop the weight before the form goes.",
          "Standing more upright every rep to make it easier.",
          "Jerking the bar with hip bounce instead of pulling with the back.",
          "Flaring the elbows out to 90 degrees — keep them about 45 degrees from the torso."
        ),
      },
      {
        name: "Machine Row",
        category: "strength",
        muscleGroup: "Lats",
        description: "Selectorized or plate-loaded row — stable base for focused back work.",
        videoUrl: yt("2dXHjarp5Xk"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Adjust the chest pad and seat so the handles are at mid-torso height with arms extended.",
          "Press your chest firmly into the pad and plant your feet.",
          "Pull the handles back, driving the elbows behind you and squeezing the back.",
          "Pause at peak contraction for a full second.",
          "Return slowly to a full stretch without letting the plates slam."
        ),
        mistakes: donts(
          "Half-repping — reach full stretch and full contraction every rep.",
          "Pulling the shoulders forward off the pad at the end of the return.",
          "Using momentum by kicking with the legs.",
          "Setting the seat too low or high so the handles pull at the wrong angle."
        ),
      },
      {
        name: "Cable Pullover",
        category: "strength",
        muscleGroup: "Lats",
        description: "Straight-arm cable pull from low to high — lat isolation without the biceps.",
        videoUrl: yt("Aib_pq5GIQk"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set a rope or bar on the low pulley and face the stack, hinged slightly forward.",
          "Grab with straight arms and a soft elbow bend, lats already engaged.",
          "Sweep the attachment down toward your thighs in a big arc, squeezing the lats.",
          "Return slowly, letting the arms travel back and up until the lats are fully stretched.",
          "Keep the same slight elbow bend from start to finish."
        ),
        mistakes: donts(
          "Bending the elbows into a curl — that turns it into an arm exercise.",
          "Rocking the hips forward and back to generate swing.",
          "Cutting the stretch short at the top.",
          "Going too heavy to feel the lat squeeze at the bottom."
        ),
      },
      {
        name: "Dumbbell Row",
        category: "strength",
        muscleGroup: "Lats",
        description: "One-arm row with a bench for support — unilateral thickness and balance.",
        videoUrl: yt("dwrmv6PNh_c"),
        difficulty: "beginner",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Place one knee and the same-side hand on the bench, back flat and parallel to the floor.",
          "Grab the dumbbell with the free hand, arm hanging straight under the shoulder.",
          "Pull the dumbbell up and back toward your hip — not to the chest.",
          "Squeeze the lat at the top, then lower to a full stretch.",
          "Complete all reps on one side before switching."
        ),
        mistakes: donts(
          "Pulling the dumbbell to the chest instead of the hip — that shifts work to the upper traps.",
          "Rotating the torso open to swing the weight up.",
          "Letting the shoulder sink at the bottom instead of feeling a lat stretch.",
          "Rushing the negative — take 2 seconds to lower."
        ),
      },
      {
        name: "Deadlift",
        category: "strength",
        muscleGroup: "Lats",
        description: "The full-body hinge — back, glutes, hamstrings and grip in one lift.",
        videoUrl: yt("ajHKoHO4PIE"),
        difficulty: "advanced",
        sets: 4,
        reps: "5",
        instructions: steps(
          "Stand with the bar over your mid-foot, feet hip-width apart.",
          "Hinge down and grip the bar just outside your legs, arms straight.",
          "Flatten your back, lift the chest, and brace your core hard.",
          "Push the floor away — the bar slides up your legs until you stand tall.",
          "Lock out by squeezing the glutes, then hinge back down with control."
        ),
        mistakes: donts(
          "Rounding the lower back — the spine stays neutral from setup to lockout.",
          "Letting the bar drift away from the shins — it should stay in contact.",
          "Jerking the bar off the floor with a yank instead of building tension first.",
          "Hyperextending the spine at the top — just stand tall and squeeze."
        ),
      },

      // ------------------------------------------------------------------ BICEPS
      {
        name: "Standing Dumbbell Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "The foundational curl — supinating dumbbells for a full biceps contraction.",
        videoUrl: yt("8jbunnjcLYQ"),
        difficulty: "beginner",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Stand tall with a dumbbell in each hand, palms facing your thighs.",
          "Pin your elbows to your sides and brace your core — no leaning back.",
          "Curl the dumbbells up, rotating the palms to face forward as they rise.",
          "Squeeze the biceps hard at the top for a second.",
          "Lower slowly to full extension before the next rep."
        ),
        mistakes: donts(
          "Swinging the torso back to start the rep — if the weight needs a swing, it's too heavy.",
          "Letting the elbows drift forward — they stay glued to your sides.",
          "Half-repping at the bottom — straighten the arms fully between reps.",
          "Curling both dumbbells with a hitch or staggered timing."
        ),
      },
      {
        name: "Standing Barbell Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "The classic barbell curl for building overall biceps mass.",
        videoUrl: yt("aDQNzO2JQr4"),
        difficulty: "beginner",
        sets: 3,
        reps: "10",
        instructions: steps(
          "Stand with feet shoulder-width, gripping the bar with palms up, hands just outside your hips.",
          "Keep your elbows tucked to your sides and shoulders down.",
          "Curl the bar up in a smooth arc without moving your upper arms.",
          "Squeeze at the top where the forearms are past vertical.",
          "Lower the bar for a full two seconds to full extension."
        ),
        mistakes: donts(
          "Throwing the hips forward to launch the bar — strict reps only.",
          "Letting the elbows flare out as the bar gets heavy.",
          "Stopping short of full extension at the bottom.",
          "Over-gripping so hard the forearms take over — firm, not crushing."
        ),
      },
      {
        name: "Standing Hammer Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Neutral-grip curl — biceps plus brachialis and forearm thickness.",
        videoUrl: yt("GVWXklAgo04"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Stand tall holding the dumbbells with palms facing each other.",
          "Keep the elbows pinned and wrists straight — no bending back.",
          "Curl the dumbbells up together, thumbs pointing up the whole way.",
          "Pause and squeeze at the top.",
          "Lower under control back to your sides."
        ),
        mistakes: donts(
          "Letting the wrists extend backward under load.",
          "Rocking the shoulders into each rep.",
          "Letting the elbows swing forward and up.",
          "Dropping the dumbbells from the top instead of controlling the negative."
        ),
      },
      {
        name: "Incline Dumbbell Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Curling from a stretched position behind the body — maximum biceps stretch.",
        videoUrl: yt("J7FgU9tNTic"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Set an incline bench to about 45 degrees and lie back with a dumbbell in each hand.",
          "Let your arms hang straight down behind your body — this is the loaded stretch.",
          "Curl the dumbbells up without letting the elbows travel forward.",
          "Squeeze at the top, then lower back to full stretch.",
          "Keep the shoulders pinned into the bench for the whole set."
        ),
        mistakes: donts(
          "Setting the bench too shallow — 45-60 degrees is the sweet spot.",
          "Dragging the elbows forward to shorten the rep.",
          "Using momentum to get out of the bottom stretch.",
          "Going too heavy — the stretched position is where form breaks first."
        ),
      },
      {
        name: "Concentration Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Seated single-arm curl that removes every cheat and isolates the peak.",
        videoUrl: yt("L2JVLUFOD1M"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Sit on a bench, legs apart, and brace your working elbow against the inside of your thigh.",
          "Let the dumbbell hang fully extended toward the floor.",
          "Curl the dumbbell up toward your shoulder in a smooth arc.",
          "Squeeze hard at the top, then lower to full stretch.",
          "Finish all reps on one arm before switching."
        ),
        mistakes: donts(
          "Swinging the arm or shoulder to start the rep.",
          "Moving the elbow off the thigh for extra leverage.",
          "Rushing the negative — the lowering half builds the most tension.",
          "Twisting the wrist up at the top."
        ),
      },
      {
        name: "Cable Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Curl with a cable for tension from the very bottom to the very top.",
        videoUrl: yt("kIEhYgJ_BSo"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set a straight bar or EZ attachment on the low pulley.",
          "Stand facing the stack, elbows at your sides, and grab the bar with palms up.",
          "Step half a pace back so the cable stays taut at the bottom.",
          "Curl the bar up, keeping the elbows and torso completely still.",
          "Squeeze at the top, then resist the cable on the way down."
        ),
        mistakes: donts(
          "Standing too close so the cable goes slack at the bottom.",
          "Leaning back as the stack pulls you forward.",
          "Letting the elbows float away from the body.",
          "Letting the stack drop and clank between reps."
        ),
      },
      {
        name: "Barbell Preacher Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Curl on the preacher bench — strict reps with the upper arms fixed.",
        videoUrl: yt("98Gh4BwOr8w"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10",
        instructions: steps(
          "Adjust the seat so your armpits rest on the top of the preacher pad.",
          "Grip the EZ or barbell with palms up, arms extended over the pad.",
          "Curl the weight up, keeping the triceps pressed into the pad.",
          "Squeeze at the top, then lower to near-full extension.",
          "Stop just before the elbows lock out hard — keep tension on the muscle."
        ),
        mistakes: donts(
          "Bouncing out of the bottom with straight, locked elbows.",
          "Lifting the triceps and elbows off the pad to cheat.",
          "Cutting the range of motion short at the top.",
          "Loading too heavy for a strict isolation exercise."
        ),
      },
      {
        name: "Machine Preacher Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Machine version of the preacher curl — fixed path, easy to load and progress.",
        videoUrl: yt("uuWzJ71aeYc"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set the seat so your armpits sit on the arm pad and the elbow pivot aligns with your elbows.",
          "Grab the handles with palms up and triceps flat on the pad.",
          "Curl the handles up through a full range, squeezing at the top.",
          "Lower slowly until the arms are almost straight.",
          "Keep your back and shoulders relaxed — only the forearms move."
        ),
        mistakes: donts(
          "Setting the pivot point away from your elbow joint.",
          "Bouncing at the bottom of each rep.",
          "Pulling with the shoulders instead of curling with the forearms.",
          "Racing through reps with no squeeze at the top."
        ),
      },
      {
        name: "EZ Bar Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Curl with the angled EZ bar — easier on the wrists than a straight bar.",
        videoUrl: yt("RjIEXtVuRNo"),
        difficulty: "beginner",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Grip the EZ bar on the inner angled sections, palms up.",
          "Stand tall with elbows pinned and shoulders down.",
          "Curl the bar up smoothly, keeping the wrists neutral.",
          "Squeeze the biceps at the top of each rep.",
          "Lower for two seconds to full arm extension."
        ),
        mistakes: donts(
          "Gripping the wide outer bends — that turns it into a drag-style curl with bent wrists.",
          "Swinging the body to start heavy reps.",
          "Letting the wrists cock back under the load.",
          "Skipping the bottom stretch between reps."
        ),
      },
      {
        name: "Cable Drag Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Curl where the elbows drift back — keeps the bar close and overloads the peak.",
        videoUrl: yt("VKW0hveCmFc"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set an EZ or straight bar on the low pulley and stand half a pace back.",
          "Start like a normal curl, palms up, elbows at your sides.",
          "As the bar rises, pull your elbows back behind your body — 'drag' the bar up your torso.",
          "Squeeze hard at the top with the bar near your chest.",
          "Lower slowly, letting the elbows travel forward again."
        ),
        mistakes: donts(
          "Letting the bar swing away from the body.",
          "Shrugging the shoulders up to finish the rep.",
          "Turning it into a shoulder extension with no biceps squeeze.",
          "Going too heavy to keep the drag path smooth."
        ),
      },
      {
        name: "Standing High Pulley Cable Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Face-away cable curl from overhead — constant tension through the long head.",
        videoUrl: yt("ZYzJDzEHzKk"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set a rope or single handle on the high pulley.",
          "Face away from the stack, take the attachment overhead with one or both hands.",
          "Step forward until the cable is taut and your arms are slightly behind your head.",
          "Curl the attachment forward and down, squeezing the biceps.",
          "Return slowly to the stretch behind your head."
        ),
        mistakes: donts(
          "Letting the cable go slack at the top of the stretch.",
          "Stepping too far forward and losing balance backward.",
          "Bending at the waist to shorten the range.",
          "Flaring the elbows out wide."
        ),
      },
      {
        name: "Forearm Curl",
        category: "strength",
        muscleGroup: "Biceps",
        description: "Wrist curls over the bench — direct forearm and grip work to finish arm day.",
        videoUrl: yt("UvYfOYVpEVQ"),
        difficulty: "beginner",
        sets: 3,
        reps: "15",
        instructions: steps(
          "Kneel beside a bench and rest your forearms on it, wrists hanging past the edge, palms up.",
          "Hold a barbell or dumbbells with a comfortable grip.",
          "Let the weight roll down to your fingertips, opening the hand slightly.",
          "Curl the wrists up as high as possible, squeezing the forearms.",
          "Lower slowly and repeat without resting between reps."
        ),
        mistakes: donts(
          "Moving the elbows or upper arms to help the wrist.",
          "Using a death-grip that fatigues the hands before the forearms.",
          "Bouncing out of the bottom stretch.",
          "Going so heavy the range shrinks to a few inches."
        ),
      },

      // ------------------------------------------------------------------ TRICEPS
      {
        name: "Seated Dumbbell Triceps Extension",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Overhead extension seated — deep long-head stretch with both hands on one dumbbell.",
        videoUrl: yt("CNNnPZiyz78"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Sit upright on a bench with a single dumbbell held overhead in both hands.",
          "Cup the inner plate with palms up, elbows pointing at the ceiling.",
          "Keep the upper arms vertical and lower the dumbbell behind your head.",
          "Go as deep as your shoulders allow, feeling the triceps stretch.",
          "Extend back to full lockout, squeezing the triceps at the top."
        ),
        mistakes: donts(
          "Flaring the elbows out to the sides — keep them close to your head.",
          "Arching the lower back to push the weight up.",
          "Cutting the bottom of the range short.",
          "Dropping the dumbbell quickly instead of controlling the negative."
        ),
      },
      {
        name: "Skullcrusher",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Lying triceps extension — the classic mass builder for all three heads.",
        videoUrl: yt("FP92hoIhs5c"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Lie on a flat bench holding an EZ bar or dumbbells over your chest, palms in.",
          "Keep the upper arms vertical and lock the elbows in place.",
          "Lower the weight toward your forehead by bending only at the elbows.",
          "Stop just short of the head, then extend back to lockout.",
          "Keep the shoulders and upper arms completely still throughout."
        ),
        mistakes: donts(
          "Letting the upper arms drift toward the feet — that turns it into a press.",
          "Lowering too fast toward the face.",
          "Flaring the elbows wide under load.",
          "Locking out with a snap that hyperextends the elbows."
        ),
      },
      {
        name: "Tricep Dip",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Upright dips on parallel bars — bodyweight triceps with a big stretch.",
        videoUrl: yt("6MwtkyNC2ZY"),
        difficulty: "intermediate",
        sets: 3,
        reps: "8-12",
        instructions: steps(
          "Mount the parallel bars and press up to straight arms, body vertical.",
          "Tuck your chin slightly and keep the elbows close to your ribs.",
          "Lower until your upper arms are parallel to the floor or slightly deeper.",
          "Press back up through the palms, fully extending the elbows.",
          "Keep the legs hanging straight or slightly forward — not swinging."
        ),
        mistakes: donts(
          "Leaning far forward and turning it into a chest exercise (fine for chest, not here).",
          "Flaring the elbows out wide.",
          "Bouncing at the bottom of the stretch.",
          "Doing half reps at the top — use the full range."
        ),
      },
      {
        name: "Bench Dips",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Dips between two benches or on the bench edge — accessible bodyweight triceps.",
        videoUrl: yt("JDVXwLwH1us"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Sit on the edge of a bench, hands gripping the edge beside your hips.",
          "Walk your feet out and slide off so your arms support your weight.",
          "Lower your body until your elbows hit about 90 degrees.",
          "Press back up, focusing on the triceps doing the work.",
          "To make it harder, extend your legs or elevate your feet on a second bench."
        ),
        mistakes: donts(
          "Dropping too deep and stressing the front of the shoulders.",
          "Letting the shoulders roll forward at the bottom.",
          "Pushing through the legs more than the arms.",
          "Setting the hands too wide so the wrists bend painfully."
        ),
      },
      {
        name: "Close-Grip Bench Press",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Bench press with a narrow grip — heavy compound triceps work.",
        videoUrl: yt("WGJyS85Li8o"),
        difficulty: "intermediate",
        sets: 4,
        reps: "8-10",
        instructions: steps(
          "Lie on the bench and grip the bar with hands just inside shoulder width.",
          "Set the shoulder blades down and back, feet planted.",
          "Unrack and lower the bar to the lower chest/upper sternum.",
          "Keep the elbows tucked at about 45 degrees from the torso.",
          "Press to full lockout, squeezing the triceps at the top."
        ),
        mistakes: donts(
          "Gripping too narrow so the wrists bend and strain.",
          "Flaring the elbows out like a wide bench press.",
          "Bouncing the bar off the chest.",
          "Lifting the hips off the bench to finish heavy reps."
        ),
      },
      {
        name: "One-Arm Standing Dumbbell Extension",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Single-arm overhead extension — fix side-to-side imbalances.",
        videoUrl: yt("DwcCeWK9K-8"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10",
        instructions: steps(
          "Stand tall holding one dumbbell overhead with a neutral grip.",
          "Keep the upper arm vertical and close to your head.",
          "Lower the dumbbell behind your head, bending only the elbow.",
          "Extend back to full lockout, squeezing the triceps.",
          "Complete all reps on one arm, then switch."
        ),
        mistakes: donts(
          "Letting the elbow drift away from the head.",
          "Arching the back to help press the weight.",
          "Using momentum from the legs.",
          "Rushing the stretch at the bottom."
        ),
      },
      {
        name: "Overhead Triceps Extension",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Cable or dumbbell extension behind the head — maximum long-head stretch.",
        videoUrl: yt("GD9SqRxE2ps"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Hold a dumbbell or rope handle behind your head, elbows bent.",
          "Keep the upper arms close to your ears and pointing up.",
          "Extend the arms until they're straight overhead.",
          "Squeeze the triceps hard at full extension.",
          "Lower back slowly to the deep stretch behind the head."
        ),
        mistakes: donts(
          "Letting the elbows splay outward.",
          "Cutting the bottom stretch short.",
          "Loading so heavy the back arches.",
          "Moving the upper arms instead of hinging only at the elbows."
        ),
      },
      {
        name: "Diamond Push-Ups",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Push-ups with hands in a diamond — bodyweight triceps burner.",
        videoUrl: yt("agUmnEqtt40"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Form a diamond under your sternum with thumbs and index fingers touching.",
          "Set the body in a rigid plank from head to heels.",
          "Lower your chest to the diamond, elbows skimming your ribs.",
          "Press back up to full lockout, squeezing the triceps.",
          "Elevate your hands on a bench if the floor version is too hard."
        ),
        mistakes: donts(
          "Flaring the elbows out wide — they must track back along the torso.",
          "Letting the hips sag mid-set.",
          "Placing the diamond too far up toward the neck.",
          "Bouncing off the bottom to get reps."
        ),
      },
      {
        name: "Dumbbell Tricep Kickback",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Hinged single-arm extension — strict isolation with a hard peak contraction.",
        videoUrl: yt("vgXmJW4Ur_k"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Hinge forward with a flat back, one hand on a bench for support.",
          "Pin the working elbow high and tight against your side.",
          "Start with the dumbbell hanging at 90 degrees of elbow bend.",
          "Extend the arm straight back until it's parallel to the floor.",
          "Pause and squeeze, then return to 90 degrees without letting the elbow drop."
        ),
        mistakes: donts(
          "Letting the elbow fall toward the floor — keep it pinned high.",
          "Swinging the dumbbell with shoulder momentum.",
          "Rushing reps with no pause at full extension.",
          "Rounding the back in the hinged position."
        ),
      },
      {
        name: "One-Arm Cable Triceps Extension",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Single-handle pushdown — constant cable tension on one arm at a time.",
        videoUrl: yt("I0tQhmepzxg"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set a single handle on the high pulley and grab it with one hand, palm down.",
          "Pin the elbow to your side and set the shoulders square.",
          "Extend the arm down until it's fully straight, splitting the handle outward at the bottom if it's a rope.",
          "Squeeze the triceps for a beat at lockout.",
          "Return slowly to 90 degrees, keeping the elbow glued in place."
        ),
        mistakes: donts(
          "Letting the elbow drift forward and back like a pendulum.",
          "Leaning the whole torso over the rep.",
          "Letting the stack slam between reps.",
          "Twisting the torso to help the working arm."
        ),
      },
      {
        name: "Triceps Extension Machine",
        category: "strength",
        muscleGroup: "Triceps",
        description: "Machine overhead extension — stable, easy to load, great for drop sets.",
        videoUrl: yt("T_7KWFtNna4"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Sit and adjust the seat so the machine's elbow pads sit just above your elbows.",
          "Grip the handles and press them up to full extension.",
          "Lower under control until the elbows are near 90 degrees.",
          "Press up smoothly, squeezing at the top.",
          "Keep your back against the pad and torso still."
        ),
        mistakes: donts(
          "Seat set wrong so the pads push on the forearms instead of above the elbows.",
          "Bouncing at the bottom of the range.",
          "Lifting the hips or back off the pad.",
          "Racing reps without a squeeze at lockout."
        ),
      },

      // ------------------------------------------------------------------ SHOULDERS
      {
        name: "Shoulder Press",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "The overhead press — barbell or dumbbells from shoulders to full lockout.",
        videoUrl: yt("nHboL27_Sn0"),
        difficulty: "intermediate",
        sets: 4,
        reps: "8-10",
        instructions: steps(
          "Sit or stand with the weight at shoulder height, palms forward, core braced.",
          "Squeeze the glutes and keep the ribs down — no leaning back.",
          "Press straight up until the arms are fully locked out overhead.",
          "Shrug slightly at the top so the shoulders support the weight, not the neck.",
          "Lower under control back to the shoulders."
        ),
        mistakes: donts(
          "Arching the lower back into a standing incline press.",
          "Pressing out in front of the face instead of straight up.",
          "Dropping the weight to the chest and bouncing it out of the bottom.",
          "Shrugging hard with the traps instead of finishing with the delts."
        ),
      },
      {
        name: "Dumbbell Lateral Raise",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "The king of side delt isolation — strict raises to shoulder height.",
        videoUrl: yt("BRn0AtJdAaU"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Stand tall with a dumbbell in each hand at your sides, slight bend in the elbows.",
          "Lean forward just a touch and tilt the dumbbells like pouring water.",
          "Raise the arms out to the sides, leading with the elbows.",
          "Stop at shoulder height — no higher.",
          "Lower slowly over two seconds, fighting the descent."
        ),
        mistakes: donts(
          "Swinging the dumbbells up with hip momentum.",
          "Raising above shoulder height and shrugging into the traps.",
          "Locking the elbows completely straight — keep them soft.",
          "Going too heavy and turning raises into jerks."
        ),
      },
      {
        name: "Arnold Press",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "Rotating dumbbell press — hits all three delt heads through a long range.",
        videoUrl: yt("7c7oBZ3MIxk"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Sit with dumbbells in front of your shoulders, palms facing you.",
          "Press up while rotating the palms to face forward.",
          "Finish with straight arms directly over the shoulders.",
          "Reverse the rotation on the way down back to the start.",
          "Keep the core braced and back against the pad."
        ),
        mistakes: donts(
          "Rotating too late — the turn should start as the press begins.",
          "Arching the back off the pad.",
          "Dropping the dumbbells into the bottom position uncontrolled.",
          "Using weights you can't control through the rotation."
        ),
      },
      {
        name: "Lateral Raise Machine",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "Machine side raise — a strict, cheat-free path for the side delts.",
        videoUrl: yt("p0TBpxVf3Jg"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Adjust the seat so the machine pads sit against the outside of your forearms or elbows.",
          "Sit tall with your back against the pad and feet flat.",
          "Raise the arms out to the sides until the pads reach shoulder height.",
          "Pause briefly at the top, feeling the side delts contract.",
          "Lower with control until the weight nearly rests, then repeat."
        ),
        mistakes: donts(
          "Setting the seat so the pads push on the wrists instead of the forearms.",
          "Shrugging to get the pads higher than shoulder level.",
          "Bouncing out of the bottom.",
          "Loading so heavy the range shrinks to a few inches."
        ),
      },
      {
        name: "Cable Face Pull",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "Rope pull to the face — rear delts, rotator cuff and posture in one move.",
        videoUrl: yt("7ZvpXA_mFpQ"),
        difficulty: "beginner",
        sets: 3,
        reps: "15",
        instructions: steps(
          "Set a rope on the high pulley at upper-chest height.",
          "Grab the rope with both hands and step back until the cable is taut.",
          "Pull the rope toward your forehead, splitting the ends apart.",
          "Rotate the hands out at the end so the rear delts and external rotators fire.",
          "Return slowly, letting the shoulder blades stretch forward."
        ),
        mistakes: donts(
          "Pulling to the chest or chin instead of the forehead/face.",
          "Letting the elbows drop below the wrists.",
          "Rocking back with each rep — stay planted.",
          "Going so heavy the rotation at the end disappears."
        ),
      },
      {
        name: "Reverse Pec Fly",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "Reverse fly on the pec deck or cables — rear delt isolation.",
        videoUrl: yt("0g3sry7-27Q"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Set the pec deck handles so you can grab them with arms extended in front.",
          "Sit facing the machine, chest against the pad, feet planted.",
          "With soft elbows, pull the handles back and out to your sides.",
          "Squeeze the rear delts at full extension, shoulder blades pinched.",
          "Return slowly to the deep stretch in front."
        ),
        mistakes: donts(
          "Using the lower back to yank the weight back.",
          "Bending the elbows into a row.",
          "Shrugging the traps up at the end of the rep.",
          "Choosing a weight that shortens the range."
        ),
      },
      {
        name: "Cable Upright Row",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "Upright row on the cable — side delts and upper back with smooth tension.",
        videoUrl: yt("JQRNR4oc1mw"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set a straight bar or rope on the low pulley.",
          "Stand close to the stack, grab the attachment, arms extended.",
          "Pull the bar up along your body, leading with the elbows.",
          "Stop when the elbows reach shoulder height.",
          "Lower slowly, resisting the cable all the way down."
        ),
        mistakes: donts(
          "Pulling the bar way above shoulder height with shrugs.",
          "Letting the bar drift away from the body.",
          "Gripping so narrow the wrists bend under load.",
          "Swinging the torso back to start each rep."
        ),
      },
      {
        name: "Front Raise",
        category: "strength",
        muscleGroup: "Shoulders",
        description: "Single or double-arm raise to the front — front delt isolation.",
        videoUrl: yt("2zA3AGh3pGk"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Stand tall with dumbbells in front of your thighs, palms facing you.",
          "Brace the core and keep a soft bend in the elbows.",
          "Raise one or both dumbbells straight out in front to eye level.",
          "Pause at the top, then lower over two seconds.",
          "Alternate arms if doing one at a time to keep tension honest."
        ),
        mistakes: donts(
          "Swinging the dumbbells up with hip bounce.",
          "Raising above eye level and leaning back.",
          "Bending the elbows more as the rep gets hard.",
          "Letting the shoulders shrug toward the ears."
        ),
      },

      // ------------------------------------------------------------------ LEGS
      {
        name: "Barbell Squat",
        category: "strength",
        muscleGroup: "Legs",
        description: "The king of leg exercises — quads, glutes and the whole posterior chain.",
        videoUrl: yt("ubLWHI0ZrSQ"),
        difficulty: "intermediate",
        sets: 4,
        reps: "6-8",
        instructions: steps(
          "Set the bar on your upper traps, grip just outside the shoulders, elbows down.",
          "Unrack, step back, and set your feet about shoulder-width, toes slightly out.",
          "Brace hard, sit the hips back and down until the thighs are at least parallel.",
          "Drive the whole foot into the floor and stand tall, knees tracking over the toes.",
          "Take a breath at the top and repeat without losing tightness."
        ),
        mistakes: donts(
          "Letting the knees cave inward out of the hole.",
          "Cutting depth high — hit at least parallel with a flat back.",
          "Lifting the heels off the floor — weight stays mid-foot.",
          "Losing the brace and rounding at the bottom."
        ),
      },
      {
        name: "Leg Extension",
        category: "strength",
        muscleGroup: "Legs",
        description: "Quad isolation on the machine — squeeze and control for knee-friendly volume.",
        videoUrl: yt("hmUYypUa4HA"),
        difficulty: "beginner",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Set the back pad and shin pad so the knee pivot aligns with the machine's axis.",
          "Hook the shins under the pad, toes pulled up toward you.",
          "Extend the legs until they're straight, squeezing the quads hard.",
          "Pause at the top for a full second.",
          "Lower over two to three seconds without letting the stack slam."
        ),
        mistakes: donts(
          "Yanking the weight up with the hips off the seat.",
          "Letting the stack drop and bounce between reps.",
          "Pointing the toes hard — keep them up to keep the quads loaded.",
          "Setting the pad too low on the shins so the knees take the load."
        ),
      },
      {
        name: "Leg Curl",
        category: "strength",
        muscleGroup: "Legs",
        description: "Hamstring isolation, seated or lying — curl the heels toward the glutes.",
        videoUrl: yt("3BWiLFc8Dbg"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set the machine so the knee pivot aligns with your knees and the pad rests on the Achilles.",
          "Keep your hips pinned down against the pad.",
          "Curl the legs, pulling the heels toward your glutes.",
          "Squeeze the hamstrings hard at full flexion.",
          "Lower slowly to near-full extension without resting between reps."
        ),
        mistakes: donts(
          "Lifting the hips to shorten the rep.",
          "Letting the legs fly back and bounce off the stops.",
          "Pointing the toes — keep them neutral or pulled back.",
          "Going so heavy the range becomes a few inches."
        ),
      },
      {
        name: "Hip Abductor/Adductor",
        category: "strength",
        muscleGroup: "Legs",
        description: "Inner and outer thigh machine work — hips, glutes and adductors.",
        videoUrl: yt("HQW7cVDvt9A"),
        difficulty: "beginner",
        sets: 3,
        reps: "15",
        instructions: steps(
          "Sit upright in the machine with your back against the pad.",
          "For abductors, press the legs outward; for adductors, pull them together.",
          "Move through a controlled full range, pausing at full contraction.",
          "Return slowly — the negative matters as much as the press.",
          "Keep your torso still and hands off the machine for momentum."
        ),
        mistakes: donts(
          "Leaning the torso into each rep for leverage.",
          "Bouncing off the end stops.",
          "Setting the range wider than your hips can control.",
          "Holding your breath through the whole set."
        ),
      },
      {
        name: "Lunges",
        category: "strength",
        muscleGroup: "Legs",
        description: "Forward or walking lunges — quads, glutes and balance in one.",
        videoUrl: yt("Zv8WWSq5bKc"),
        difficulty: "beginner",
        sets: 3,
        reps: "10-12/leg",
        instructions: steps(
          "Stand tall, then take a long step forward onto your working leg.",
          "Lower straight down until both knees are around 90 degrees.",
          "Keep the front knee tracking over the front toes and the torso tall.",
          "Push through the whole front foot to step back or forward.",
          "Alternate legs, or finish one side before switching."
        ),
        mistakes: donts(
          "Taking short steps so the front knee shoots past the toes with the heel lifted.",
          "Leaning the torso forward and dumping into the front hip.",
          "Letting the back knee crash into the floor.",
          "Pushing off with the back foot more than the front."
        ),
      },
      {
        name: "Calf Raise Machine",
        category: "strength",
        muscleGroup: "Legs",
        description: "Machine calf raises — full stretch, hard squeeze, slow tempo.",
        videoUrl: yt("RBslMmWqzzE"),
        difficulty: "beginner",
        sets: 4,
        reps: "15",
        instructions: steps(
          "Set the shoulder pads and step onto the platform with the balls of your feet.",
          "Lower your heels as far as the stretch allows — calves fully lengthened.",
          "Press up onto the balls of your feet as high as possible.",
          "Pause and squeeze the calves at the top for a full second.",
          "Lower slowly through a full two seconds."
        ),
        mistakes: donts(
          "Bouncing out of the bottom with no control.",
          "Skipping the top pause — the squeeze is the point.",
          "Bending the knees to recruit the quads.",
          "Loading so heavy the range shrinks to an inch."
        ),
      },
      {
        name: "Sumo Dumbbell Squat",
        category: "strength",
        muscleGroup: "Legs",
        description: "Wide-stance squat holding one dumbbell — inner thighs and glutes.",
        videoUrl: yt("nMaOjuM3rJU"),
        difficulty: "beginner",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Take a wide stance with toes pointed out about 45 degrees.",
          "Hold a single heavy dumbbell vertically between your legs.",
          "Sit the hips down and back, chest up, knees tracking over the toes.",
          "Go as deep as you can with a flat back, feeling the inner thighs load.",
          "Drive through the whole foot back to standing, squeezing the glutes."
        ),
        mistakes: donts(
          "Letting the knees collapse inward.",
          "Rounding the back to get deeper.",
          "Lifting the heels as you descend.",
          "Swinging the dumbbell for momentum."
        ),
      },
      {
        name: "Romanian Deadlift",
        category: "strength",
        muscleGroup: "Legs",
        description: "Hip-hinge with soft knees — hamstrings and glutes through a deep stretch.",
        videoUrl: yt("-m45n1_x32E"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10",
        instructions: steps(
          "Stand holding a barbell or dumbbells in front of your thighs.",
          "Soften the knees and set your back flat, shoulders pinned back.",
          "Push the hips straight back, sliding the weight down your thighs.",
          "Lower until you feel a deep hamstring stretch — usually just below the knees.",
          "Drive the hips forward and squeeze the glutes to stand tall."
        ),
        mistakes: donts(
          "Bending the knees into a squat — the shins stay near vertical.",
          "Rounding the back at the bottom of the stretch.",
          "Letting the bar drift away from the legs.",
          "Lowering too far and turning it into a back stretch rather than a hamstring load."
        ),
      },
      {
        name: "Leg Press",
        category: "strength",
        muscleGroup: "Legs",
        description: "Machine press for quads and glutes — big weight, fixed path.",
        videoUrl: yt("-Nw8EWUrJuQ"),
        difficulty: "beginner",
        sets: 4,
        reps: "10-12",
        instructions: steps(
          "Sit with your back and hips pressed into the pad, feet shoulder-width on the platform.",
          "Unlock the safeties without slamming the weight down.",
          "Lower the platform until your knees reach about 90 degrees, heels planted.",
          "Press through the whole foot — never just the toes.",
          "Re-rack by re-engaging the safety stops, not by slamming."
        ),
        mistakes: donts(
          "Letting the knees cave inward under load.",
          "Bouncing the bottom with the pelvis rolling off the pad.",
          "Placing the feet so low the heels lift at the bottom.",
          "Locking the knees violently at the top."
        ),
      },
      {
        name: "Hack Squat",
        category: "strength",
        muscleGroup: "Legs",
        description: "Angled machine squat — quad emphasis with full back support.",
        videoUrl: yt("iZefNtyVInE"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Step onto the platform and set your feet shoulder-width, slightly forward.",
          "Release the safeties and stand with knees soft, back flat on the pad.",
          "Lower under control until the thighs are at least parallel.",
          "Keep the knees tracking over the toes and full foot contact.",
          "Drive up through the heels and mid-foot, knees soft at the top."
        ),
        mistakes: donts(
          "Placing the feet too far down the platform so the knees travel past the toes harshly.",
          "Half-repping the descent.",
          "Letting the hips shift off the pad.",
          "Re-racking by slamming the stops."
        ),
      },

      // ------------------------------------------------------------------ ABS
      {
        name: "Crunches",
        category: "strength",
        muscleGroup: "Abs",
        description: "The basic curl-up — short range, upper abs, neck protected.",
        videoUrl: yt("Plh1CyiPE_Y"),
        difficulty: "beginner",
        sets: 3,
        reps: "15",
        instructions: steps(
          "Lie on your back, knees bent, feet flat, fingertips lightly behind your ears.",
          "Draw your ribs down toward your pelvis — it's a small curling motion, not a sit-up.",
          "Lift the shoulder blades just off the floor and squeeze the abs.",
          "Exhale hard at the top.",
          "Lower slowly without letting the head drop or the neck pull."
        ),
        mistakes: donts(
          "Pulling on the neck with interlocked hands.",
          "Anchoring the feet so the hip flexors take over.",
          "Coming all the way up into a sit-up — that changes the exercise.",
          "Rushing reps with no squeeze at the top."
        ),
      },
      {
        name: "Cable Crunch",
        category: "strength",
        muscleGroup: "Abs",
        description: "Weighted kneeling crunch on the cable — overload the abs like any muscle.",
        videoUrl: yt("sWhrHEFRFrs"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12-15",
        instructions: steps(
          "Set a rope on the high pulley and kneel facing the stack, holding the rope at the sides of your head.",
          "Hips stay locked and still — only the spine curls.",
          "Crunch down, driving the ribs toward the pelvis.",
          "Squeeze the abs hard at the bottom, exhaling fully.",
          "Return to a tall stretch without letting the stack yank you up."
        ),
        mistakes: donts(
          "Bending at the hips and turning it into a bow.",
          "Pulling with the arms instead of curling the spine.",
          "Letting the stack drop and bounce between reps.",
          "Going so heavy the range becomes tiny."
        ),
      },
      {
        name: "Hanging Leg Raise",
        category: "strength",
        muscleGroup: "Abs",
        description: "Hang from the bar and raise the legs — lower abs and hip flexors with a grip bonus.",
        videoUrl: yt("fLsF--vdKvw"),
        difficulty: "intermediate",
        sets: 3,
        reps: "10-12",
        instructions: steps(
          "Hang from a pull-up bar with a full grip, arms straight.",
          "Set your shoulders by pulling them slightly down away from your ears.",
          "Raise the legs, knees or straight, up to at least hip height.",
          "Control the descent — no swinging.",
          "Stop the legs just short of hanging loose to keep tension on the abs."
        ),
        mistakes: donts(
          "Swinging and kipping each rep.",
          "Dropping the legs uncontrolled on the way down.",
          "Bending the arms into a pull-up hang.",
          "Shrugging the shoulders into the ears the whole set."
        ),
      },
      {
        name: "Ab Crunch Machine",
        category: "strength",
        muscleGroup: "Abs",
        description: "Selectorized crunch — add real load to ab training with a fixed path.",
        videoUrl: yt("M_mJC7Vg_qc"),
        difficulty: "beginner",
        sets: 3,
        reps: "15",
        instructions: steps(
          "Set the seat so the chest pad sits at mid-chest and the pivot matches your hips.",
          "Grip the handles and stack your ribs over your pelvis.",
          "Curl forward, pushing the pad with your chest, not your arms.",
          "Squeeze at full flexion, then return to the stretch.",
          "Keep the motion smooth — the machine adds the resistance, not momentum."
        ),
        mistakes: donts(
          "Pulling with the arms to move the weight.",
          "Bouncing out of the bottom position.",
          "Setting the seat so the pivot point is wrong and the hips take the load.",
          "Holding the breath through every rep."
        ),
      },
      {
        name: "Plank",
        category: "strength",
        muscleGroup: "Abs",
        description: "The isometric core hold — and all its variations (side plank, plank to press, etc.).",
        videoUrl: yt("VSxMbkeh_X8"),
        difficulty: "beginner",
        sets: 3,
        durationSec: 45,
        instructions: steps(
          "Place your forearms on the floor, elbows directly under the shoulders.",
          "Extend the legs back, tucking the toes under.",
          "Squeeze the glutes and brace the abs as if taking a punch.",
          "Keep one straight line from head to heels — look at the floor slightly ahead.",
          "Breathe steadily behind the brace and hold for the target time."
        ),
        mistakes: donts(
          "Letting the hips sag toward the floor.",
          "Piking the hips up too high to make it easier.",
          "Holding the breath the entire time.",
          "Looking up and cranking the neck."
        ),
      },
      {
        name: "Mountain Climbers",
        category: "strength",
        muscleGroup: "Abs",
        description: "Fast knee drives from a plank — core plus a serious cardio hit.",
        videoUrl: yt("7W_oOFc_2kQ"),
        difficulty: "beginner",
        sets: 3,
        durationSec: 40,
        instructions: steps(
          "Set a strong high plank, hands under the shoulders.",
          "Drive one knee toward your chest.",
          "Switch legs in the air, landing softly with the other knee driven in.",
          "Keep the hips level — no bouncing up and down.",
          "Build speed while keeping the core braced and hands planted."
        ),
        mistakes: donts(
          "Letting the hips rise into a downward dog shape.",
          "Bouncing on the hands with every switch.",
          "Reaching the knee only halfway in.",
          "Holding the breath — keep breathing rhythmically."
        ),
      },
      {
        name: "Glute Bridge",
        category: "strength",
        muscleGroup: "Abs",
        description: "Hip thrust on the floor — glutes and core with zero equipment.",
        videoUrl: yt("K-JRy9O_85A"),
        difficulty: "beginner",
        sets: 3,
        reps: "15",
        instructions: steps(
          "Lie on your back, knees bent, heels close to your glutes, arms by your sides.",
          "Push through the heels and lift the hips until the body forms a straight line.",
          "Squeeze the glutes hard at the top for a full second.",
          "Keep the ribs down — don't arch the lower back.",
          "Lower slowly and repeat without letting the glutes rest on the floor."
        ),
        mistakes: donts(
          "Over-arching the lower back at the top instead of squeezing the glutes.",
          "Pushing through the toes so the quads take over.",
          "Letting the knees splay outward.",
          "Dropping the hips uncontrolled on the way down."
        ),
      },
      {
        name: "Air Bike",
        category: "strength",
        muscleGroup: "Abs",
        description: "Lying bicycle — opposite elbow to knee, alternating obliques and abs.",
        videoUrl: yt("MxQej8uGcTw"),
        difficulty: "beginner",
        sets: 3,
        reps: "20/side",
        instructions: steps(
          "Lie on your back, hands lightly behind your head, legs in tabletop.",
          "Extend one leg while bringing the opposite knee in.",
          "Rotate the torso to touch the opposite elbow to that knee.",
          "Switch sides in a pedaling rhythm.",
          "Keep the lower back pressed gently into the floor."
        ),
        mistakes: donts(
          "Pulling on the neck with the hands.",
          "Rushing so fast the rotation disappears.",
          "Letting the extended leg rest on the floor between reps.",
          "Flaring the elbows wide instead of rotating the ribcage."
        ),
      },
      {
        name: "Roman Chair Twisting Knee Raise",
        category: "strength",
        muscleGroup: "Abs",
        description: "Knee raises with a twist on the roman chair — abs plus obliques.",
        videoUrl: yt("ITF8LCSpgwg"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12/side",
        instructions: steps(
          "Mount the roman chair, forearms on the pads and back against the support.",
          "Let the legs hang, shoulders set down away from the ears.",
          "Raise the knees while twisting the hips so the knees aim to one side.",
          "Lower with control, then alternate the twist direction each rep.",
          "Keep the movement slow — no swinging."
        ),
        mistakes: donts(
          "Swinging the legs for momentum.",
          "Dropping the legs uncontrolled.",
          "Shrugging the shoulders up into the pads.",
          "Twisting from the shoulders instead of the waist."
        ),
      },
      {
        name: "Russian Twist",
        category: "strength",
        muscleGroup: "Abs",
        description: "Seated rotation with weight — obliques and deep core.",
        videoUrl: yt("Uyg0fW_9Scg"),
        difficulty: "beginner",
        sets: 3,
        reps: "20",
        instructions: steps(
          "Sit tall, lean back about 45 degrees, and lift the feet off the floor.",
          "Hold a dumbbell or plate with both hands at chest level.",
          "Rotate the chest and shoulders to tap the weight beside one hip.",
          "Rotate to the other side — that's one rep.",
          "Keep the spine tall and the movement driven by the waist, not the arms."
        ),
        mistakes: donts(
          "Just moving the arms side to side with no torso rotation.",
          "Rounding the back into a hunch.",
          "Letting the feet drop and rest every few reps (unless scaling).",
          "Twisting too fast to feel the obliques work."
        ),
      },
      {
        name: "Oblique Cable Crunch",
        category: "strength",
        muscleGroup: "Abs",
        description: "Weighted side crunch on the cable — targeted oblique overload.",
        videoUrl: yt("JYVexCKvLno"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12/side",
        instructions: steps(
          "Set a single handle on the high pulley and grab it with one hand, facing sideways.",
          "Stand with feet wide, hips locked and still.",
          "Crunch down and toward the side of the working oblique.",
          "Squeeze at the bottom, then return to a full side stretch.",
          "Finish all reps on one side before turning around."
        ),
        mistakes: donts(
          "Bending at the hips instead of side-crunching the spine.",
          "Pulling with the arm instead of contracting the obliques.",
          "Letting the stack drop and bounce.",
          "Standing so close the cable goes slack at the stretch."
        ),
      },

      // ------------------------------------------------------------------ CARDIO
      {
        name: "Jumping Jacks",
        category: "cardio",
        muscleGroup: "Cardio",
        description: "The timeless warm-up and cardio staple — full body, zero equipment.",
        videoUrl: yt("2hZpofIX_Do"),
        difficulty: "beginner",
        sets: 3,
        durationSec: 45,
        instructions: steps(
          "Stand tall with feet together and arms at your sides.",
          "Jump the feet out wide while raising the arms overhead.",
          "Jump back to the start in one smooth motion.",
          "Land softly on the balls of the feet every rep.",
          "Find a steady rhythm you can hold for the full interval."
        ),
        mistakes: donts(
          "Landing with locked, stiff knees — stay springy.",
          "Slapping the arms against the thighs instead of raising them overhead.",
          "Letting the rhythm fall apart and stopping early.",
          "Holding the breath — breathe in rhythm with the jumps."
        ),
      },
      {
        name: "High Knees",
        category: "cardio",
        muscleGroup: "Cardio",
        description: "Running in place with the knees driven to hip height — engine work plus hip flexors.",
        videoUrl: yt("viN6KBpWVJs"),
        difficulty: "beginner",
        sets: 3,
        durationSec: 45,
        instructions: steps(
          "Stand tall and start running in place.",
          "Drive each knee up to at least hip height.",
          "Pump the arms naturally opposite the legs.",
          "Stay on the balls of the feet with quick, light contacts.",
          "Keep the chest up and core braced through the interval."
        ),
        mistakes: donts(
          "Leaning back and reaching the knees forward instead of up.",
          "Heavy, flat-footed landings.",
          "Letting the hips drop with each step.",
          "Starting too fast and gassing out ten seconds in."
        ),
      },
      {
        name: "Jump Rope",
        category: "cardio",
        muscleGroup: "Cardio",
        description: "Skipping — coordination, calves and cardio in one rope.",
        videoUrl: yt("XSqj0O6ARMs"),
        difficulty: "beginner",
        sets: 3,
        durationSec: 60,
        instructions: steps(
          "Size the rope by stepping on the middle — the handles should reach your armpits.",
          "Hold the handles at hip height, elbows close to the ribs.",
          "Turn the rope with the wrists, not big arm circles.",
          "Jump just high enough to clear the rope, landing softly.",
          "Start steady — speed comes after rhythm."
        ),
        mistakes: donts(
          "Jumping too high and landing hard — it should be a low bounce.",
          "Swinging the whole arms instead of flicking the wrists.",
          "Looking down at the feet instead of straight ahead.",
          "Slouching — stand tall with the core on."
        ),
      },

      // ------------------------------------------------- CARDIO (explosive)
      {
        name: "Battle Ropes",
        category: "cardio",
        muscleGroup: "Cardio",
        description: "Alternating rope waves — shoulders, core and lungs burning together.",
        videoUrl: yt("4i-vBYXuFho"),
        difficulty: "intermediate",
        sets: 3,
        durationSec: 30,
        instructions: steps(
          "Face the anchor with feet shoulder-width, hinged slightly forward, knees soft.",
          "Grab both rope ends with a firm grip.",
          "Alternate explosive waves, one arm up as the other comes down.",
          "Keep the chest up and core braced — the power comes from the shoulders, not the lower back.",
          "Hold the tempo for the full interval without stalling."
        ),
        mistakes: donts(
          "Straightening the knees and standing bolt upright — stay athletic.",
          "Making small lazy waves when fatigued.",
          "Letting the ropes drag on the floor between reps.",
          "Holding the breath — short sharp exhales match the waves."
        ),
      },
      {
        name: "Jump Squats",
        category: "cardio",
        muscleGroup: "Cardio",
        description: "Squat and explode into a jump — leg power with a cardio punch.",
        videoUrl: yt("Zst45ePyW8c"),
        difficulty: "intermediate",
        sets: 3,
        reps: "12",
        instructions: steps(
          "Set feet shoulder-width and squat to at least parallel with a tall chest.",
          "Explode up off the floor, arms swinging for height.",
          "Land softly on the balls of the feet, sinking straight into the next squat.",
          "Cycle the reps with no pause at the bottom.",
          "Keep the knees tracking over the toes on every landing."
        ),
        mistakes: donts(
          "Landing with locked knees and no give.",
          "Shallow squats — hit depth before the jump.",
          "Letting the knees cave inward on landing.",
          "Jumping for height so hard form breaks down."
        ),
      },
      {
        name: "Burpees",
        category: "cardio",
        muscleGroup: "Cardio",
        description: "Squat, plank, push-up, jump — the full-body conditioning test.",
        videoUrl: yt("p5JeZJVIvIA"),
        difficulty: "intermediate",
        sets: 4,
        reps: "15",
        instructions: steps(
          "From standing, drop the hands to the floor and jump the feet back into a plank.",
          "Lower the chest to the floor (add the push-up here) and press back up.",
          "Jump the feet back in under the chest.",
          "Explode upward with a jump, hands overhead.",
          "Land softly and flow straight into the next rep."
        ),
        mistakes: donts(
          "Skipping the plank and flopping to the floor.",
          "Landing from the jump with stiff, straight legs.",
          "Letting the hips sag during the plank and push-up.",
          "Breaking between every rep — the point is continuous movement."
        ),
      },
    ];
    await db.insert(exercises).values(exerciseRows);
    console.log(`Seeded ${exerciseRows.length} exercises.`);
  }

  console.log("Done.");
  process.exit(0);
}

seed();

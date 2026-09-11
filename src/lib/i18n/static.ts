export type Lang = "en" | "hi" | "ta";

export const LANGS: Lang[] = ["en", "hi", "ta"];

export const LANG_LABEL: Record<Lang, string> = {
  en: "EN",
  hi: "हिं",
  ta: "தமிழ்",
};

const S = {
  // Nav
  "nav.home": { en: "Home", hi: "होम", ta: "முகப்பு" },
  "nav.workouts": { en: "Workouts", hi: "वर्कआउट", ta: "பயிற்சிகள்" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल", ta: "சுயவிவரம்" },

  // Home
  "home.eyebrow": { en: "Ready when you are", hi: "जब भी आप तैयार हों", ta: "நீங்கள் தயாராக இருக்கும்போது" },
  "home.trainHard": { en: "TRAIN HARD,", hi: "ज़ोर से ट्रेन करें,", ta: "கடினமாக பயிற்சி செய்யுங்கள்," },
  "home.weeklySchedule": { en: "WEEKLY SCHEDULE", hi: "साप्ताहिक शेड्यूल", ta: "வாராந்திர அட்டவணை" },
  "home.today": { en: "Today", hi: "आज", ta: "இன்று" },
  "home.restDayNote": {
    en: "Sunday is a rest day. Head to the Workouts tab, pick your body part, and follow the exercise guides.",
    hi: "रविवार आराम का दिन है। वर्कआउट टैब पर जाएं, अपना बॉडी पार्ट चुनें, और एक्सरसाइज़ गाइड को फॉलो करें।",
    ta: "ஞாயிறு ஓய்வு நாள். பயிற்சிகள் தாவலுக்குச் சென்று, உடல் பகுதியைத் தேர்ந்து, உடற்பயிற்சி வழிகாட்டுதல்களைப் பின்பற்றவும்.",
  },

  // Schedule focuses
  "sched.chestTriceps": { en: "Chest & Triceps", hi: "चेस्ट और ट्राइसेप्स", ta: "மார்பு மற்றும் டிரைசெப்ஸ்" },
  "sched.backBiceps": { en: "Back & Biceps", hi: "बैक और बाइसेप्स", ta: "முதுகு மற்றும் பைசெப்ஸ்" },
  "sched.shoulders": { en: "Shoulders", hi: "शोल्डर", ta: "தோள்கள்" },
  "sched.legsAbs": { en: "Legs & Abs", hi: "लेग्स और एब्स", ta: "கால்கள் மற்றும் அப்ஸ்" },
  "sched.cardio": { en: "Cardio", hi: "कार्डियो", ta: "கார்டியோ" },
  "sched.circuit": { en: "Circuit Training", hi: "सर्किट ट्रेनिंग", ta: "சர்க்யூட் பயிற்சி" },

  // Days
  "day.mon": { en: "Monday", hi: "सोमवार", ta: "திங்கள்" },
  "day.tue": { en: "Tuesday", hi: "मंगलवार", ta: "செவ்வாய்" },
  "day.wed": { en: "Wednesday", hi: "बुधवार", ta: "புதன்" },
  "day.thu": { en: "Thursday", hi: "गुरुवार", ta: "வியாழன்" },
  "day.fri": { en: "Friday", hi: "शुक्रवार", ta: "வெள்ளி" },
  "day.sat": { en: "Saturday", hi: "शनिवार", ta: "சனி" },
  "day.sun": { en: "Sunday", hi: "रविवार", ta: "ஞாயிறு" },

  // Workouts page
  "workouts.blurb": {
    en: "Pick a body part and tap an exercise to see exactly how to do it.",
    hi: "बॉडी पार्ट चुनें और एक्सरसाइज़ पर टैप करके जानें कि उसे सही तरीके से कैसे करें।",
    ta: "உடல் பகுதியைத் தேர்ந்து, உடற்பயிற்சியைத் தட்டி அதை எப்படி சரியாகச் செய்வது என்று பார்க்கவும்.",
  },
  "workouts.all": { en: "All", hi: "सभी", ta: "அனைத்தும்" },
  "workouts.today": { en: "Today", hi: "आज", ta: "இன்று" },
  "workouts.circuitTitle": { en: "CIRCUIT TRAINING", hi: "सर्किट ट्रेनिंग", ta: "சர்க்யூட் பயிற்சி" },
  "workouts.circuitText": {
    en: "Do 1 exercise from each body part — chest, triceps, lats, biceps, shoulders, legs and abs — back to back with minimal rest. That is 1 round. Complete 3 to 5 rounds.",
    hi: "हर बॉडी पार्ट से 1 एक्सरसाइज़ करें — चेस्ट, ट्राइसेप्स, लैट्स, बाइसेप्स, शोल्डर, लेग्स और एब्स — बिना ज़्यादा आराम के एक के बाद एक। यह 1 राउंड हुआ। कुल 3 से 5 राउंड पूरे करें।",
    ta: "ஒவ்வொரு உடல் பகுதியிலிருந்தும் 1 உடற்பயிற்சி செய்யுங்கள் — மார்பு, டிரைசெப்ஸ், லாட்ஸ், பைசெப்ஸ், தோள்கள், கால்கள் மற்றும் அப்ஸ் — இடையில் குறைந்த ஓய்வுடன் தொடர்ந்து. இது 1 சுற்று. மொத்தம் 3 முதல் 5 சுற்றுகள் முடிக்கவும்.",
  },

  // Warning banner
  "warn.lead": { en: "Train smart:", hi: "समझदारी से ट्रेन करें:", ta: "புத்திசாலித்தனமாக பயிற்சி செய்யுங்கள்:" },
  "warn.body": {
    en: "warm up first, use weights you can control with good form, and stop immediately if you feel pain, dizziness or shortness of breath. Consult a physician before starting a new exercise program.",
    hi: "पहले वार्म-अप करें, ऐसे वेट का इस्तेमाल करें जिन्हें आप सही फॉर्म से कंट्रोल कर सकें, और दर्द, चक्कर या सांस फूलने पर तुरंत रुक जाएं। नई एक्सरसाइज़ शुरू करने से पहले डॉक्टर की सलाह लें।",
    ta: "முதலில் வார்ம்-அப் செய்யுங்கள், நல்ல உடலமைப்புடன் கட்டுப்படுத்தக்கூடிய எடைகளை மட்டும் பயன்படுத்துங்கள், வலி, தலைச்சுற்றல் அல்லது மூச்சுத் திணறல் ஏற்பட்டால் உடனே நிறுத்துங்கள். புதிய உடற்பயிற்சியைத் தொடங்கும் முன் மருத்துவரின் ஆலோசனை பெறுங்கள்.",
  },

  // Exercise detail
  "detail.howTo": { en: "HOW TO DO IT", hi: "कैसे करें", ta: "எப்படி செய்வது" },
  "detail.notTo": { en: "WHAT NOT TO DO", hi: "क्या न करें", ta: "என்ன செய்யக்கூடாது" },
  "detail.form": { en: "FORM GUIDE", hi: "फॉर्म गाइड", ta: "உருவ வழிகாட்டி" },
  "detail.motion": { en: "MOTION DEMO", hi: "मोशन डेमो", ta: "அசைவு செயல்விளக்கம்" },
  "detail.start": { en: "Start", hi: "शुरुआत", ta: "தொடக்கம்" },
  "detail.finish": { en: "Finish", hi: "अंतिम स्थिति", ta: "முடிவு" },
  "detail.tip": {
    en: "Warm up with lighter sets first, keep every rep strict, and stop the set when your form starts to break down.",
    hi: "पहले हल्के सेट से वार्म-अप करें, हर रेप स्ट्रिक्ट रखें, और फॉर्म बिगड़ने लगे तो सेट रोक दें।",
    ta: "முதலில் இலகு நிலைகளால் வார்ம்-அப் செய்யுங்கள், ஒவ்வொரு முறையும் சரியாகச் செய்யுங்கள், உடலமைப்பு சரியாக இல்லாத போது நிறுத்திவிடுங்கள்.",
  },
  "detail.back": { en: "← Back to the exercise menu", hi: "← वर्कआउट मेनू पर वापस जाएं", ta: "← பயிற்சி பட்டியலுக்குத் திரும்பவும்" },
  "detail.notFound": { en: "Exercise not found.", hi: "एक्सरसाइज़ नहीं मिली।", ta: "உடற்பயிற்சி கிடைக்கவில்லை." },

  // Profile
  "profile.assignedGym": { en: "Assigned gym", hi: "आपका जिम", ta: "ஒதுக்கப்பட்ட ஜிம்" },
  "profile.gymLoading": { en: "Loading…", hi: "लोड हो रहा है…", ta: "ஏற்றுகிறது…" },
  "profile.adminLink": { en: "Admin — gym branches", hi: "एडमिन — जिम ब्रांच", ta: "நிர்வாகம் — ஜிம் கிளைகள்" },
  "profile.adminSub": { en: "Configure branches and members", hi: "ब्रांच और मेंबर कॉन्फ़िगर करें", ta: "கிளைகள் மற்றும் உறுப்பினர்களை நிர்வகிக்கவும்" },
  "profile.memberFallback": { en: "Infinity Fitness member", hi: "इन्फिनिटी फिटनेस मेंबर", ta: "இன்ஃபினிட்டி ஃபிட்னஸ் உறுப்பினர்" },
  "profile.signOut": { en: "SIGN OUT", hi: "साइन आउट", ta: "வெளியேறு" },
  "profile.signingOut": { en: "SIGNING OUT…", hi: "साइन आउट हो रहा है…", ta: "வெளியேறுகிறது…" },
  "profile.signedOut": { en: "Signed out.", hi: "साइन आउट हो गए।", ta: "வெளியேறினீர்கள்." },

  // Login
  "login.subtitle": { en: "Admin only · sign in", hi: "केवल एडमिन · साइन इन", ta: "நிர்வாகம் மட்டும் · உள்நுழை" },
  "login.username": { en: "Username", hi: "यूज़रनेम", ta: "பயனர்பெயர்" },
  "login.password": { en: "Password", hi: "पासवर्ड", ta: "கடவுச்சொல்" },
  "login.submit": { en: "Sign in", hi: "साइन इन", ta: "உள்நுழை" },

  // Language toggle
  "lang.toggle": { en: "Language", hi: "भाषा", ta: "மொழி" },

  // Geo lock screen
  "geo.title": { en: "LOCATION CHECK", hi: "लोकेशन जांच", ta: "இருப்பிட சரிபார்ப்பு" },
  "geo.subtitle": {
    en: "Workouts unlock only when you are at the gym.",
    hi: "वर्कआउट तभी खुलते हैं जब आप जिम पर हों।",
    ta: "நீங்கள் ஜிம்மில் இருக்கும்போது மட்டுமே பயிற்சிகள் திறக்கும்.",
  },
  "geo.gym": { en: "Gym", hi: "जिम", ta: "ஜிம்" },
  "geo.radius": { en: "Allowed radius", hi: "अनुमत रेडियस", ta: "அனுமதிக்கப்பட்ட ஆரம்" },
  "geo.verify": { en: "VERIFY MY LOCATION", hi: "मेरी लोकेशन जांचें", ta: "எனது இருப்பிடத்தை சரிபார்க்கவும்" },
  "geo.verifying": { en: "VERIFYING…", hi: "जांच हो रही है…", ta: "சரிபார்க்கிறது…" },
  "geo.verified": {
    en: "Location verified — workouts unlocked.",
    hi: "लोकेशन verified — वर्कआउट अनलॉक हो गए।",
    ta: "இருப்பிடம் சரிபார்க்கப்பட்டது — பயிற்சிகள் திறக்கப்பட்டன.",
  },
  "geo.outside": {
    en: "You appear to be outside the gym area",
    hi: "आप जिम एरिया के बाहर लग रहे हैं",
    ta: "நீங்கள் ஜிம் பகுதிக்கு வெளியே இருப்பதாகத் தெரிகிறது",
  },
  "geo.poorAccuracy": {
    en: "GPS signal is too weak — move to an open area and try again.",
    hi: "GPS सिग्नल बहुत कमज़ोर है — खुली जगह पर जाकर फिर कोशिश करें।",
    ta: "GPS சமிக்ஞை மிகவும் பலவீனம் — திறந்த இடத்திற்குச் சென்று மீண்டும் முயற்சிக்கவும்.",
  },
  "geo.gpsError": {
    en: "Could not read your position. Allow location permission and try again.",
    hi: "आपकी लोकेशन नहीं मिल पाई। लोकेशन परमिशन देकर फिर कोशिश करें।",
    ta: "உங்கள் இருப்பிடம் பெற முடியவில்லை. இருப்பிட அனுமதியை வழங்கி மீண்டும் முயற்சிக்கவும்.",
  },
  "geo.distance": { en: "Distance from gym", hi: "जिम से दूरी", ta: "ஜிம்மிலிருந்து தூரம்" },
  "geo.testToggle": { en: "Test with custom coordinates", hi: "कस्टम निर्देशांकों से टेस्ट करें", ta: "தனிப்பயன் ஆயத்தொடர்களுடன் சோதிக்கவும்" },
  "geo.testCheck": { en: "CHECK", hi: "जांचें", ta: "சரிபார்க்கவும்" },
  "geo.testInside": { en: "INSIDE the fence — would unlock", hi: "फेंस के अंदर — अनलॉक होगा", ta: "வேலியின் உள்ளே — திறக்கும்" },
  "geo.testOutside": { en: "OUTSIDE the fence — would stay locked", hi: "फेंस के बाहर — लॉक रहेगा", ta: "வேலியின் வெளியே — பூட்டப்பட்டே இருக்கும்" },
  "geo.validFor": {
    en: "Access valid for 15 minutes after each verification.",
    hi: "हर वेरिफिकेशन के बाद एक्सेस 15 मिनट के लिए मान्य है।",
    ta: "ஒவ்வொரு சரிபார்ப்புக்குப் பிறகும் அணுகல் 15 நிமிடங்கள் செல்லுபடியாகும்.",
  },
} as const;

export type StringKey = keyof typeof S;

export function tr(lang: Lang, key: StringKey): string {
  const entry = S[key];
  return (entry[lang] as string) ?? entry.en;
}

// Body-part group labels (values match the DB muscleGroup values).
export const GROUP_LABELS: Record<string, { en: string; hi: string; ta: string }> = {
  Chest: { en: "Chest", hi: "चेस्ट", ta: "மார்பு" },
  Triceps: { en: "Triceps", hi: "ट्राइसेप्स", ta: "டிரைசெப்ஸ்" },
  Lats: { en: "Lats", hi: "लैट्स", ta: "லாட்ஸ்" },
  Biceps: { en: "Biceps", hi: "बाइसेप्स", ta: "பைசெப்ஸ்" },
  Shoulders: { en: "Shoulders", hi: "शोल्डर", ta: "தோள்கள்" },
  Legs: { en: "Legs", hi: "लेग्स", ta: "கால்கள்" },
  Abs: { en: "Abs", hi: "एब्स", ta: "அப்ஸ்" },
  Cardio: { en: "Cardio", hi: "कार्डियो", ta: "கார்டியோ" },
};

export function groupLabel(lang: Lang, group: string): string {
  const g = GROUP_LABELS[group];
  return g ? (g[lang] ?? g.en) : group;
}

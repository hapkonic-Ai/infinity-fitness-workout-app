import { createContext } from "react";
import type { Lang } from "./static";

export const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: "en", setLang: () => {} });

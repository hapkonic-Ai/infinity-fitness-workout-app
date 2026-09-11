import { useContext } from "react";
import { LanguageContext } from "./language-context";
import { tr, type StringKey } from "./static";

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Returns a translator for the current language. */
export function useT() {
  const { lang } = useLanguage();
  return (key: StringKey) => tr(lang, key);
}

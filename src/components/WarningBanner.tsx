import { TriangleAlert } from "lucide-react";
import { useT } from "@/lib/i18n/use-language";

/** Safety notice shown above every exercise list / workout. */
export function WarningBanner() {
  const t = useT();
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-3">
      <TriangleAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <p className="text-xs leading-relaxed text-foreground/80">
        <span className="font-semibold text-primary">{t("warn.lead")}</span>{" "}
        {t("warn.body")}
      </p>
    </div>
  );
}

import { useState } from "react";
import { Crosshair, FlaskConical, MapPin, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { useT } from "@/lib/i18n/use-language";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerifyResult =
  | { result: "verified"; gymName: string; distance: number }
  | { result: "outside"; gymName: string; distance: number }
  | { result: "accuracy_poor"; gymName: string; accuracy: number | null };

function TestPanel() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [outcome, setOutcome] = useState<VerifyResult | null>(null);
  const verify = trpc.geo.verifyLocation.useMutation({
    onSuccess: (res) => {
      setOutcome(res);
      if (res.result === "verified") toast.success(t("geo.verified"));
    },
    onError: (e) => toast.error(e.message),
  });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mx-auto"
      >
        <FlaskConical className="h-3.5 w-3.5" /> {t("geo.testToggle")}
      </button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 space-y-3 text-left">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-widest">Latitude</Label>
          <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="12.960293" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-widest">Longitude</Label>
          <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="79.154320" />
        </div>
      </div>
      <button
        disabled={verify.isPending || !lat || !lng}
        onClick={() =>
          verify.mutate({ latitude: Number(lat), longitude: Number(lng), accuracy: 10 })
        }
        className="w-full rounded-xl bg-primary py-2.5 font-display text-lg tracking-widest text-primary-foreground disabled:opacity-40"
      >
        {verify.isPending ? "…" : t("geo.testCheck")}
      </button>
      {outcome && (
        <p
          className={
            outcome.result === "verified"
              ? "text-sm font-medium text-green-500"
              : outcome.result === "outside"
                ? "text-sm font-medium text-primary"
                : "text-sm text-muted-foreground"
          }
        >
          {outcome.result === "verified" && `${t("geo.testInside")} · ${outcome.distance}m`}
          {outcome.result === "outside" &&
            `${t("geo.testOutside")} · ${t("geo.distance")}: ${outcome.distance}m`}
          {outcome.result === "accuracy_poor" && t("geo.poorAccuracy")}
        </p>
      )}
    </div>
  );
}

/** Full-screen gate shown when the member has no valid location session. */
export function GeoLock({ gymName, radiusMeters }: { gymName: string; radiusMeters: number }) {
  const t = useT();
  const utils = trpc.useUtils();
  const [outcome, setOutcome] = useState<VerifyResult | null>(null);

  const verify = trpc.geo.verifyLocation.useMutation({
    onSuccess: async (res) => {
      setOutcome(res);
      if (res.result === "verified") {
        await utils.invalidate();
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const verifyFromGps = () => {
    setOutcome(null);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        verify.mutate({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      () => toast.error(t("geo.gpsError")),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <div className="min-h-dvh dot-grid flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm text-center space-y-6 animate-fade-up">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border border-primary/40 bg-card flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl tracking-wide">{t("geo.title")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("geo.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {t("geo.gym")}
          </p>
          <p className="font-medium">{gymName}</p>
          <p className="font-display text-2xl text-primary">
            {radiusMeters}m
            <span className="text-xs text-muted-foreground ml-1 font-sans tracking-normal">
              {t("geo.radius")}
            </span>
          </p>
        </div>

        <button
          onClick={verifyFromGps}
          disabled={verify.isPending}
          className="w-full rounded-2xl bg-primary py-4 font-display text-xl tracking-widest text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Crosshair className="h-5 w-5" />
          {verify.isPending ? t("geo.verifying") : t("geo.verify")}
        </button>

        {outcome?.result === "verified" && (
          <p className="text-sm font-medium text-green-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            {t("geo.verified")}
          </p>
        )}
        {outcome?.result === "outside" && (
          <p className="text-sm font-medium text-primary">
            {t("geo.outside")} — {t("geo.distance").toLowerCase()}: {outcome.distance}m
          </p>
        )}
        {outcome?.result === "accuracy_poor" && (
          <p className="text-sm text-muted-foreground">{t("geo.poorAccuracy")}</p>
        )}

        <p className="text-xs text-muted-foreground">{t("geo.validFor")}</p>

        <TestPanel />

        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          INFINITY<span className="text-primary">FITNESS</span>
        </p>
      </div>
    </div>
  );
}
